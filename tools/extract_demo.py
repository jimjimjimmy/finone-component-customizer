"""Turn the engineer's /blocks sections into component props (js/demo/granite.json).
The demo content is therefore the engineer's own placeholder copy, with brand colours expressed as token names."""
import re, json, pathlib, lxml.html as L
root = pathlib.Path(__file__).resolve().parent.parent
BG = {'noBg':'none','bgWhite':'white','bgGray':'surface','bgSunset':'accent','bgDenim':'dark','bgSky':'secondary','bgGranite':'tint','bgHaze':'tertiary','bgField':'highlight'}
RGB = {'249,77,43':'accent','75,86,168':'tertiary','28,43,57':'dark','#1c2b39':'dark','#f94d2b':'accent'}
def cl(e): return (e.get('class') or '').split()
def bg_of(e):
    for c in cl(e):
        if c in BG: return BG[c]
    return 'none'
def sp(e):
    d = {}
    for c in cl(e):
        m = re.match(r'(pt|pb|mt|mb)-(none|\d+)$', c)
        if m: d[m.group(1)] = int(m.group(2)) if m.group(2) != 'none' else 'none'
    return d
def asset(u):
    return None if not u else 'assets/uploads/' + u.split('/')[-1].split('?')[0]
def img_of(e, xp='.//img'):
    if e is None: return None
    r = e.xpath(xp); return asset(r[0].get('src')) if len(r) else None
def inner(e):
    if e is None: return ''
    s = (e.text or '') + ''.join(L.tostring(c, encoding='unicode') for c in e)
    return re.sub(r'\s+', ' ', s).strip()
def one(e, xp):
    r = e.xpath(xp); return r[0] if r else None
def txt(e, xp):
    return inner(one(e, xp))
def btns(e):
    out = []
    for a in e.xpath('.//a[contains(@class,"btn")]'):
        v = [c[4:] for c in cl(a) if c.startswith('btn-')]
        out.append({k: val for k, val in {'label': re.sub(r'\s+', ' ', a.text_content()).strip(), 'href': a.get('href'), 'variant': v[0] if v else 'primary', 'aria': a.get('aria-label')}.items() if val})
    return out
def style_color(e):
    s = e.get('style') or ''
    m = re.search(r'background-color:\s*([^;]+)', s)
    if not m: return None
    v = m.group(1).strip().lower()
    m2 = re.match(r'rgb\((\d+),\s*(\d+),\s*(\d+)\)', v)
    k = ','.join(m2.groups()) if m2 else v
    return RGB.get(k, v)
def lay(sec, name):
    r = sec.xpath(f'.//div[contains(concat(" ",@class," ")," {name} ")]'); return r[0] if r else None
def intro_of(sec, i=0):
    ls = sec.xpath('.//div[contains(concat(" ",@class," ")," intro ")]')
    if len(ls) <= i: return {}
    l = ls[i]
    col = one(l, './/div[contains(@class,"col-")]')
    w = re.search(r'col-lg-(\d+)', ' '.join(cl(col))).group(1)
    pe = one(l, './/p')
    d = {'eyebrow': txt(l, './/div[@class="eyebrow"]'), 'title': txt(l, './/h2'), 'body': inner(pe) if pe is not None else None, 'width': int(w)}
    return {k: v for k, v in d.items() if v not in ('', None) or (k == 'body' and pe is not None)}
def hero(sec):
    l = lay(sec, 'hero')
    c = cl(l); size = next(x.split('-')[1] for x in c if x in ('hero-marquee','hero-large','hero-medium','hero-small','hero-boxed'))
    boxed = size == 'boxed'
    if boxed: size = 'large' if 'hlarge' in c else 'small'
    content = one(sec, './/div[contains(@class,"hero-content")]')
    row = one(sec, './/div[contains(@class,"row")]')
    p = {'size': size, 'boxed': boxed, 'tone': 'light' if 'text-light' in cl(content) else 'dark', 'reverse': 'reverse' in c,
         'image': img_of(one(sec, './/div[contains(@class,"hero-picture")]')), 'imageClass': (one(sec, './/div[contains(@class,"hero-picture")]//img').get('class') if one(sec, './/div[contains(@class,"hero-picture")]//img') is not None else None),
         'eyebrow': txt(content, './/div[@class="eyebrow"]'), 'title': txt(content, './/h1'), 'body': txt(content, './/p') or None,
         'buttons': btns(content), 'noImage': 'no-image' in cl(row)}
    if boxed: p['bg'] = bg_of(sec)
    else:
        p['bg'] = bg_of(l)
        sc = style_color(l)
        if sc: p['bgColor'] = sc
    if size == 'marquee':
        m = re.search(r'opacity:\s*(\d+)%', (one(sec, './/div[contains(@class,"hero-picture")]').get('style') or '')); p['overlay'] = int(m.group(1)) if m else 50
    if sec.get('id'): p['id'] = sec.get('id')
    return {'type': 'hero', 'props': p}
LIVE_TABLES = {  # rendered client-side by Finalytics JS on the engineer's page, so absent from the static HTML; copied from the live DOM
 'regular_savings': (['Account','Minimum Balance to Earn Dividends','APY*'], [['Primary Share Savings','$5','0.10%'],['MoneyWise Primary Share','$5','3.00%'],['Traditional and Roth IRA Savings','$0','1.00%']]),
 'regular_checking': (['Account','Minimum Balance to Earn Dividends','APY*'], [['Advantage Checking','$0.00-$20,000','1.00%'],['Basic Checking','N/A','0.00%']])}
def table_rows(sec):
    t = one(sec, './/table')
    if t is None: return LIVE_TABLES[one(sec, './/div[@data-table-name]').get('data-table-name')]
    cols = [inner(x) for x in t.xpath('.//thead//th')]
    rows = [[inner(td) for td in tr.xpath('./td')] for tr in t.xpath('.//tbody/tr')]
    return cols, rows

def tok_style(s):
    if not s: return None
    s = s.replace('https://finone.finalytics.ai/wp-content/uploads/', 'assets/uploads/')
    for hexv, tok in (('#1c2b39', 'dark'), ('#f94d2b', 'accent'), ('rgb(249,77,43)', 'accent'), ('rgb(249, 77, 43)', 'accent'), ('rgb(75,86,168)', 'tertiary')):
        s = s.replace(hexv, f'var(--color-{tok})')
    return s
def sec_props(sec):
    d = {k: v for k, v in sp(sec).items() if k in ('pt', 'pb')}
    return d
def cards_items(sec, kind):
    out = []
    for w in sec.xpath('.//div[contains(@class,"card-wrapper")]'):
        c = one(w, './div[contains(@class,"card")]')
        link = one(c, './/div[contains(@class,"card-footer")]//a')
        d = {'title': txt(c, './/h3'), 'body': inner(one(c, './/div[contains(@class,"card-body")]/p[last()]')) if one(c, './/div[contains(@class,"card-body")]/p') is not None else '',
             'icon': img_of(c, './/div[contains(@class,"card-icon")]//img'), 'image': img_of(c, './/div[contains(@class,"card-image")]//img'),
             'eyebrow': txt(c, './/div[@class="eyebrow"]') or None}
        if link is not None and kind == 'product': d['link'] = {'label': inner(link), 'href': link.get('href'), 'aria': link.get('aria-label') or ''}
        out.append({k: v for k, v in d.items() if v not in (None, '')})
    return out
def spec(e, with_id=False):
    d = {}
    for k in ('pt', 'pb', 'mt', 'mb'):
        m = next((c for c in cl(e) if c.startswith(k + '-')), None)
        d[k] = False if m is None else (int(m[3:]) if m[3:].isdigit() else m[3:])
    bgc = next((BG[c] for c in cl(e) if c in BG), None)
    d['bg'] = bgc if bgc else False
    if with_id and e.get('id'): d['id'] = e.get('id')
    if with_id and e.get('style'): d['style'] = tok_style(e.get('style'))
    return d
def spacing_of(sec):
    out = {'section': spec(sec, True), 'layouts': {}}
    ls = sec.xpath('.//div[contains(concat(" ",@class," ")," layout ")]')
    first_intro = True
    for l in ls:
        names = [c for c in cl(l) if c != 'layout']
        if not names: continue
        n = names[0]
        if n == 'intro':
            if first_intro: out['intro'] = spec(l, True); first_intro = False
            continue
        if n not in out['layouts']: out['layouts'][n] = spec(l, True)
    return out
def gen(sec, i):
    L_ = sec.xpath('.//div[contains(concat(" ",@class," ")," layout ")]')
    names = [c for x in L_ for c in cl(x)]
    sp_ = sec_props(sec); sbg = bg_of(sec)
    def S(p):
        p = {**sp_, **p}
        if sbg != 'none': p['bg'] = sbg
        return p
    if 'hero' in names: return hero(sec)
    if one(sec, './/div[@class="yoast-breadcrumbs"]') is not None:
        return {'type': 'breadcrumbs', 'props': {'crumbs': [{'label': 'Home', 'href': 'https://finone.finalytics.ai/'}, {'label': 'ACF Custom Blocks', 'href': '#'}]}}
    if 'anchor-bar' in names:
        return {'type': 'anchorBar', 'props': {'links': [{'label': inner(a), 'href': a.get('href')} for a in sec.xpath('.//a')]}}
    if 'fin-cd-calculator' in L.tostring(sec, encoding='unicode'): return {'type': 'certificateCalculator', 'props': {}}
    if 'rate-cards' in names:
        tiles = []
        for c in sec.xpath('.//div[contains(@class,"swiper-slide")]'):
            hd = one(c, './/div[@class="card-header"]'); a = one(hd, './/a'); body = one(c, './/div[@class="card-body"]'); rg = one(body, './/div[@class="rate-group"]')
            tl = {'icon': img_of(hd), 'title': inner(a) if a is not None else re.sub(r'\s+', ' ', hd.text_content()).strip(), 'cta': {'label': txt(c, './/a[contains(@class,"btn")]'), 'href': one(c, './/a[contains(@class,"btn")]').get('href')}}
            if a is not None: tl['href'] = a.get('href')
            if rg is not None: tl['rate'] = {'lead': re.sub(r'\s+', ' ', body.text.strip()), 'value': txt(rg, './/div[@class="div1"]'), 'unit': txt(rg, './/div[@class="div2"]'), 'label': re.sub(r'<sup>.*', '', txt(rg, './/div[@class="div3"]'))}
            else: tl['text'] = txt(body, './/div[@class="card-text"]')
            tiles.append(tl)
        return {'type': 'rateCards', 'props': {**sp_, 'tiles': tiles, 'buttons': btns(lay(sec, 'buttons-group'))}}
    if 'rates' in names:
        cols, rows = table_rows(sec); tc = one(sec, './/div[@class="table-ctas"]'); aa = tc.xpath('.//a')
        return {'type': 'rateTable', 'props': {'bg': sbg, **sp_, **{k: v for k, v in intro_of(sec).items() if k in ('title', 'body')}, 'name': one(sec, './/div[@data-table-name]').get('data-table-name'), 'columns': cols, 'rows': rows,
                'learn': {'label': inner(aa[0]), 'href': aa[0].get('href')}, 'open': {'label': re.sub(r'\s+', ' ', aa[1].text_content()).strip(), 'href': aa[1].get('href')}}}
    if 'quicklinks' in names:
        ql = lay(sec, 'quicklinks'); items = []
        for li in ql.xpath('.//li'):
            a = one(li, './a'); items.append({k: v for k, v in {'icon': img_of(li), 'title': txt(li, './/h3'), 'text': txt(li, './/p') or None, 'href': a.get('href') if a is not None else None}.items() if v})
        return {'type': 'quicklinks', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'items': items, 'link': one(ql, './/a[@class="ql-item"]') is not None, 'descriptions': one(ql, './/li//p') is not None}}
    if 'tabs' in names:
        panels = []
        for b in sec.xpath('.//button[@data-bs-toggle="tab"]'):
            panels.append({'label': inner(b), 'target': b.get('data-bs-target')[1:]})
        for b, pane in zip(panels, sec.xpath('.//div[contains(@class,"tab-pane")]')):
            blk = gen(pane, i); blk['props']['nested'] = True; b['block'] = blk
        return {'type': 'tabs', 'props': {**sp_, 'panels': panels, 'id': one(sec, './/ul[contains(@class,"nav-tabs")]').get('id')}}
    if 'feature-grid' in names:
        row = one(sec, './/div[contains(@class,"row")]'); gi = one(sec, './/div[contains(@class,"feature-grid-items")]')
        items = []
        for it in gi.xpath('./div[contains(@class,"feature-grid-item")]'):
            a = one(it, './a'); d = {'icon': img_of(it), 'title': txt(it, './/h3'), 'text': txt(it, './/p')}
            if a is not None: d['link'] = {'label': inner(a), 'href': a.get('href'), 'aria': a.get('aria-label') or ''}
            items.append(d)
        mb = one(sec, './/div[contains(@class,"feature-main-content")]')
        return {'type': 'featureGrid', 'props': {**S({}), 'boxed': 'boxed' in cl(row), 'border': 'with-border' in cl(gi), 'layout': 'vertical' if 'vertical-layout' in cl(gi) else 'grid',
                'main': {'image': img_of(one(mb, './div[contains(@class,"feature-image")]')), 'eyebrow': txt(mb, './/div[@class="eyebrow"]'), 'title': txt(mb, './/h2'), 'body': txt(mb, './/p'), 'button': (btns(mb) or [None])[0]}, 'items': items}}
    if 'promo-cards' in names:
        cs = []
        for c in sec.xpath('.//div[contains(concat(" ",@class," ")," promo-card ")]'):
            b = one(c, './/div[contains(@class,"card-body")]'); cs.append({'eyebrow': txt(b, './/p[@class="eyebrow"]'), 'title': txt(b, './/h3'), 'body': re.sub(r'\s+', ' ', ''.join(x.tail or '' for x in b.xpath('./h3'))).strip(), 'button': btns(b)[0], 'image': img_of(c, './/div[@class="card-image"]//img')})
        return {'type': 'promoCards', 'props': {**S({}), 'title': intro_of(sec).get('title'), 'body': intro_of(sec).get('body'), 'cards': cs}}
    if 'get-products' in names:
        return {'type': 'productCards', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'noBorder': 'no-border' in names, 'cards': cards_items(sec, 'product')}}
    if 'get-posts' in names:
        posts = []
        for w in sec.xpath('.//div[contains(@class,"card-wrapper")]'):
            a = one(w, './/h3/a'); f = one(w, './/div[contains(@class,"card-footer")]//a')
            posts.append({'image': img_of(w), 'eyebrow': txt(w, './/div[@class="eyebrow"]'), 'title': inner(a), 'href': a.get('href'), 'excerpt': txt(w, './/div[contains(@class,"card-body")]/p'), 'cta': inner(f)})
        bg_ = lay(sec, 'buttons-group')
        return {'type': 'postCards', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'tone': 'light' if one(sec, './/div[contains(@class,"intro")]//div[contains(@class,"text-light")]') is not None else None, 'noBorder': 'no-border' in names, 'posts': posts, 'buttons': btns(bg_) if bg_ is not None else []}}
    if 'get-post' in names:
        items = []
        for w in sec.xpath('.//div[contains(@class,"card-wrapper")]'):
            f = one(w, './/div[contains(@class,"card-footer")]//a')
            items.append({'image': img_of(w), 'title': txt(w, './/h3'), 'body': txt(w, './/div[contains(@class,"card-body")]/p'), 'href': f.get('href'), 'aria': f.get('aria-label'), 'cta': inner(f)})
        return {'type': 'mixMatch', 'props': {**sp_, 'bg': 'none', 'sectionStyle': sec.get('style'), 'eyebrow': intro_of(sec).get('eyebrow'), 'title': intro_of(sec).get('title'), 'body': intro_of(sec).get('body'), 'items': items, 'buttons': btns(lay(sec, 'buttons-group'))}}
    if 'promo' in names:
        pl = lay(sec, 'promo'); variant = next(c.split('-')[1] for c in cl(pl) if c.startswith('promo-'))
        row = one(sec, './/div[contains(@class,"row")]'); pc = one(sec, './/div[contains(@class,"promo-content")]')
        return {'type': 'promo', 'props': {'variant': variant, 'reverse': 'reverse' in cl(row), 'bg': bg_of(pl), 'sectionBg': sbg, 'secSp': sp_, **sp(pl), 'logo': img_of(pc, './/div[@class="promo-logo"]//img'), 'eyebrow': txt(pc, './/div[@class="eyebrow"]'), 'title': txt(pc, './/h2'), 'body': txt(pc, './/p'), 'buttons': btns(pc), 'image': img_of(one(sec, './/div[contains(@class,"promo-image")]')), 'imageClass': (one(sec, './/div[contains(@class,"promo-image")]//img').get('class') or None)}}
    if 'banner' in names:
        v = 'boxed' if 'banner-boxed' in names else 'full'; bc = one(sec, './/div[contains(@class,"banner-content")]'); bl = bc.xpath('.//div[@class="banner-logo"]//img')
        return {'type': 'banner', 'props': {'variant': v, **S({}), 'video': asset(one(sec, './/source').get('src')), 'poster': img_of(one(sec, './/div[@class="banner-video"]')), 'logo': asset(bl[0].get('src')) if bl else None, 'eyebrow': txt(bc, './/div[@class="eyebrow"]'), 'title': txt(bc, './/h2'), 'body': txt(bc, './/p'), 'buttons': btns(bc), 'id': sec.get('id')}}
    if 'compare-table-block' in names:
        ths = sec.xpath('.//thead//th'); cols = []
        for th in ths:
            st = one(th, './strong'); br = th.xpath('./br'); cols.append({'name': inner(st), 'sub': re.sub(r'\s+', ' ', (br[0].tail or '') if br else '').strip(), 'blurb': txt(th, './div')})
        foot = sec.xpath('.//tfoot//a')
        for c, a in zip(cols, foot): c['button'] = {'label': inner(a), 'href': a.get('href')}
        def cell(td): return {'check': True} if td.xpath('.//img') else inner(td)
        tl = [cell(td) for td in sec.xpath('.//tbody/tr[1]/td')[1:]]
        rows = [{'label': inner(tr.xpath('./th')[0]), 'cells': [cell(td) for td in tr.xpath('./td')]} for tr in sec.xpath('.//tbody/tr')[1:]]
        return {'type': 'compareTable', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'columns': cols, 'taglines': tl, 'rows': rows, 'check': asset(one(sec, './/tbody//img').get('src'))}}
    if 'steps' in names:
        sl = lay(sec, 'steps'); ss = []; v = 'number'
        for s in sl.xpath('.//div[contains(@class,"step ")]'):
            d = {'title': txt(s, './/h3'), 'body': txt(s, './/p')}
            if one(s, './div[@class="step-icon"]') is not None: v = 'icon'; d['icon'] = img_of(s)
            elif one(s, './div[@class="step-img"]') is not None: v = 'image'; d['image'] = img_of(s)
            ss.append(d)
        return {'type': 'steps', 'props': {'variant': v, 'bg': sbg, **{k: v_ for k, v_ in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'steps': ss, 'pb': sp(sl).get('pb', 100)}}
    if 'logo-grid' in names:
        lg = []
        for it in sec.xpath('.//div[contains(@class,"logo-grid-item")]'):
            a = one(it, './a'); lg.append({'src': img_of(it), **({'href': a.get('href'), 'label': a.get('aria-label'), 'host': a.get('alt')} if a is not None else {})})
        return {'type': 'logoGrid', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'logos': lg}}
    if 'blockquote' in names:
        slides = [{'quote': txt(s, './/blockquote/p'), 'by': txt(s, './/div[contains(@class,"blockquote-footer")]')} for s in sec.xpath('.//div[contains(@class,"swiper-slide")]')]
        boxed = one(sec, './/div[contains(@class,"boxed")]') is not None
        return {'type': 'quotes', 'props': {'variant': 'boxed' if boxed else 'plain', **S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'slides': slides}}
    if 'faqs' in names:
        items = [{'q': re.sub(r'\s+', ' ', ''.join(x.tail or '' for x in b.xpath('./div[@class="plusminus"]'))).strip(), 'a': inner(one(b.getparent(), './/div[@class="accordion-body"]'))} for b in sec.xpath('.//button[contains(@class,"accordion-button")]')]
        return {'type': 'faq', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'items': items}}
    if 'flexible-columns' in names:
        fc = lay(sec, 'flexible-columns')
        return {'type': 'flexibleColumns', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'columns': [inner(c) for c in fc.xpath('.//div[@class="colx"]')]}}
    if 'content-block' in names:
        w = one(sec, './/div[contains(@class,"wysiwyg")]'); cb = lay(sec, 'content-block')
        return {'type': 'richText', 'props': {'html': inner(w), **{k: v for k, v in sp(cb).items()}, 'width': int(re.search(r'col-lg-(\d+)', L.tostring(cb, encoding='unicode')).group(1))}}
    if 'cards' in names:
        cls_ = [c for x in L_ if 'cards' in cl(x) for c in cl(x)]
        cardsEls = sec.xpath('.//div[contains(@class,"card-wrapper")]')
        first = one(cardsEls[0], './div[contains(@class,"card")]')
        if 'action_card' in cl(first):
            cs = [{'eyebrow': txt(w, './/div[@class="eyebrow"]'), 'title': txt(w, './/h3'), 'body': txt(w, './/p'), 'buttons': btns(w)} for w in cardsEls]
            return {'type': 'actionCards', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'cards': cs}}
        cs = []
        for w in cardsEls:
            c = one(w, './div[contains(@class,"card")]'); ty = 'image' if 'with_image' in cl(c) else 'icon' if 'with_icon' in cl(c) else 'simple'
            d = {'type': ty, 'title': txt(c, './/h3'), 'body': txt(c, './/div[contains(@class,"card-body")]/p'), 'image': img_of(c, './/div[contains(@class,"card-image")]//img'), 'icon': img_of(c, './/div[contains(@class,"card-icon")]//img')}
            b = btns(c); d = {k: v for k, v in d.items() if v}
            if b: d['button'] = b[0]
            cs.append(d)
        bg_ = lay(sec, 'buttons-group')
        return {'type': 'staticCards', 'props': {**S({}), **{k: v for k, v in intro_of(sec).items() if k in ('eyebrow', 'title', 'body')}, 'cards': cs, 'buttons': btns(bg_) if bg_ is not None else []}}
    if 'disclosures' in names:
        return {'type': 'disclosures', 'props': {}}
    if names.count('intro') and not [n for n in set(names) if n not in ('layout','intro') and not re.match(r'(pt|pb|mt|mb)-|bg[A-Z]|noBg', n)]:
        l = lay(sec, 'intro'); col = one(sec, './/div[contains(@class,"col-")]'); row = one(sec, './/div[contains(@class,"row")]')
        boxed = 'boxed' in cl(row)
        d = {**intro_of(sec), 'icon': img_of(one(sec, './/div[@class="icon"]')), 'buttons': btns(sec), 'boxed': boxed, 'boxedStyle': tok_style(row.get('style')) if boxed else None,
             'align': 'center', 'tone': 'light' if 'text-light' in cl(col) else None, 'bg': bg_of(l), **{k: v for k, v in sp(l).items()}, 'secBg': sbg, 'secSp': sp_, 'style': tok_style(l.get('style'))}
        return {'type': 'introSection', 'props': {k: v for k, v in d.items() if v not in (None, '', [])}}
    return {'type': '_unmapped', 'props': {'names': names}}
secs = [s for s in L.parse(str(root / 'source' / 'blocks.html')).getroot().xpath('//section[contains(@class,"acf-section")]') if not s.xpath('ancestor::section[contains(@class,"acf-section")]')]
out = {}
for i, s in enumerate(secs):
    out[i] = gen(s, i); out[i]['props']['spacing'] = spacing_of(s)
_disc = [x for x in L.parse(str(root / 'source' / 'blocks.html')).getroot().xpath('//section[contains(@class,"acf-section")]') if x.xpath('.//div[contains(concat(" ",@class," ")," disclosures ")]')][-1]  # innermost
_d = one(_disc, './/div[contains(@class,"disclosure-content")]')
out[57] = {'type': 'disclosures', 'props': {'html': re.sub(r'^<h6>.*?</h6>\s*', '', inner(_d)), 'spacing': spacing_of(_disc)}}
(root / 'js' / 'demo').mkdir(exist_ok=True)
(root / 'js' / 'demo' / 'granite.json').write_text(json.dumps(out, indent=1, ensure_ascii=False))
print(len(out), 'extracted so far')
