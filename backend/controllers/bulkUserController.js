const csv = require('csv-parse')
const xlsx = require('xlsx')
const path = require('path')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid')

const parseCsv = (content) => {
  return new Promise((resolve, reject) => {
    csv.parse(content, { columns: true, trim: true }, (err, records) => {
      if (err) return reject(err)
      resolve(records)
    })
  })
}

const generateTempPassword = () => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~[]{}|;:,.<>?'
  let password = ''
  for (let i = 0; i < 12; i += 1) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password
}

const parseXlsx = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' })
  return rows
}

const buildTemplate = () => {
  const headers = ['fullname', 'email', 'phone', 'level']
  const csvRows = [headers.join(',')]
  return csvRows.join('\n')
}

const createUsersFromRows = async (rows, defaultPassword) => {
  const report = {
    created: [],
    skipped: [],
    errors: []
  }

  for (const row of rows) {
    const fullname = row.fullname || row.Fullname || row.name || row.Name
    const email = row.email || row.Email
    const phone = row.phone || row.Phone
    const level = Number(row.level || row.Level || 1)
    const rowIdentifier = email || fullname || uuidv4()

    if (!fullname || !email) {
      report.skipped.push({ row: rowIdentifier, reason: 'fullname and email are required' })
      continue
    }

    const existing = await User.findOne({ email })
    if (existing) {
      report.skipped.push({ row: rowIdentifier, reason: 'email already exists' })
      continue
    }

    try {
      const password = defaultPassword || generateTempPassword()
      const user = await User.signup(email, password, fullname, level || 1, phone, true)
      report.created.push({ email: user.email, fullname: user.fullname, level: user.level, tempPassword: password })
    } catch (error) {
      report.errors.push({ row: rowIdentifier, message: error.message })
    }
  }

  return report
}

const downloadTemplate = (req, res) => {
  const csvData = buildTemplate()
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="staff-template.csv"')
  res.send(csvData)
}

const uploadUsers = async (req, res) => {
  const defaultPassword = process.env.DEFAULT_STAFF_PASSWORD
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File upload required' })
    }

    const buffer = req.file.buffer
    const ext = path.extname(req.file.originalname).toLowerCase()
    let rows = []

    if (ext === '.csv') {
      rows = await parseCsv(buffer.toString())
    } else if (ext === '.xls' || ext === '.xlsx') {
      rows = parseXlsx(buffer)
    } else {
      return res.status(400).json({ error: 'Only .csv, .xls, and .xlsx files are supported' })
    }

    const report = await createUsersFromRows(rows, defaultPassword)

    res.status(200).json({ report, defaultPassword })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { downloadTemplate, uploadUsers }
