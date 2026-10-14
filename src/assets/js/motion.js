// Scroll reveals, staggering and hero word split.
// Selectors live here so the HTML needs almost no changes.

// 1. Split [data-split] text into words (keeps nested tags like the orange <span>)
document.querySelectorAll('[data-split]').forEach(el => {
    let n = 0;
    (function walk(node) {
        [...node.childNodes].forEach(child => {
            if (child.nodeType !== 3) return walk(child);
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(part => {
                if (!part.trim()) return frag.append(part);
                const w = document.createElement('span');
                const inner = document.createElement('span');
                w.className = 'w';
                inner.textContent = part;
                inner.style.setProperty('--i', n++);
                w.append(inner);
                frag.append(w);
            });
            child.replaceWith(frag);
        });
    })(el);
});

// 2. Mark things to reveal. Children of these groups get a stagger index.
const groups = '.projects, .services, .feats, .results, .quotes, .grid, .faq, .stack';
document.querySelectorAll(groups).forEach(g =>
    [...g.children].forEach((c, i) => { c.classList.add('reveal'); c.style.setProperty('--i', i); })
);

const singles = [
    'main section:not(.hero) > .wrap > :is(h2, .lead)',
    '.wrap.cta > :is(h2, p)',
    '.body-copy', '.about > *', '.contact > *',
    '.shot.wide', '.pair', '.next'
].join(', ');
document.querySelectorAll(singles).forEach(el => el.classList.add('reveal'));

// 3. Reveal when scrolled into view
const items = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
} else {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    items.forEach(el => io.observe(el));
}