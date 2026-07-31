// Assign stagger index variables to children of elements with class 'stagger'
function applyStaggerTo(root=document){
  const groups = root.querySelectorAll('.stagger')
  groups.forEach(group => {
    const children = Array.from(group.children)
    children.forEach((child, i) => {
      child.style.setProperty('--stagger-index', i)
    })
    // trigger reflow to allow CSS animations to run
    group.offsetHeight
    group.classList.add('stagger-initialized')
  })
}

// Run on load
if (typeof window !== 'undefined'){
  document.addEventListener('DOMContentLoaded', ()=>applyStaggerTo())
  // also run shortly after to catch client-rendered elements
  setTimeout(()=>applyStaggerTo(), 300)

  // add subtle page animation to wrappers
  const applyPageAnimate = (root=document)=>{
    const wrappers = root.querySelectorAll('.wrapper, main')
    wrappers.forEach(w => w.classList.add('page-animate'))
  }
  applyPageAnimate()

  // observe DOM mutations to re-apply when new nodes mount (useful for SPA routes)
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.addedNodes && m.addedNodes.length) applyStaggerTo(m.target)
    })
    applyPageAnimate()
  })
  mo.observe(document.body, {childList:true, subtree:true})
}

export default applyStaggerTo
