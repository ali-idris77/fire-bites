const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    name: "Firey Bites",
                    email: process.env.SMTP_FROM
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                htmlContent: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || JSON.stringify(data));
        }

        return data;
    } catch (err) {
        console.error("Brevo Email Error:", err.message);
        throw err;
    }
};

module.exports = sendEmail;