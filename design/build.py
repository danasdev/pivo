import re,base64,sys,os
A='/home/dk/Documentos/Codes/Pivô/assets/web/'
fonts=open('/home/dk/Documentos/Codes/Pivô/assets/fonts/fonts.css').read()
STAR='<svg viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8Z"/></svg>'
def stars(r): return '<div class="stars">'+STAR*5+f'<span>{r}</span></div>'
HEART='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z"/></svg>'
def prod(m):
    img,badge,cls,nm,pr,rt,st=m.group(1).split('|')
    b=f'<span class="badge {cls}">{badge}</span>' if badge else ''
    return (f'<div class="prod"><div class="ph"><img src="{{{{img:{img}}}}}" alt="{nm}">{b}<span class="fav">{HEART}</span></div>'
            f'<div class="meta"><div class="nm">{nm}</div><div class="line"><div class="pr">{pr}</div>{stars(rt)}</div><div class="stock"><i></i>{st}</div></div></div>')
CHEV='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
ARR='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></svg>'
PLUS='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
def card(m):
    im,t,n=m.group(1).split('|')
    return f'<a class="card"><img src="{{{{img:{im}}}}}" alt="{t}"><div class="shade"></div><div class="cap"><div><h3>{t}</h3><div class="n">{n}</div></div><div class="go">{ARR}</div></div></a>'
def mprod(m):
    im,badge,cls,nm,pr,rt,st=m.group(1).split('|')
    b=f'<span class="badge {cls}">{badge}</span>' if badge else ''
    return (f'<div class="prod"><div class="ph"><img src="{{{{img:{im}}}}}" alt="{nm}">{b}<span class="fav"><span>{HEART}</span></span><span class="plus" aria-label="Adicionar à sacola">{PLUS}</span></div>'
            f'<div class="meta"><div class="nm">{nm}</div><div class="line"><div class="pr">{pr}</div>{stars(rt)}</div><div class="stock"><i></i>{st}</div></div></div>')
def img(m):
    f=m.group(1); d=open(A+f,'rb').read()
    mt='image/png' if f.endswith('png') else 'image/jpeg'
    return f'data:{mt};base64,'+base64.b64encode(d).decode()
for src in sys.argv[1:]:
    s=open(src).read()
    s=s.replace('{{fonts}}',fonts).replace('{{star}}',STAR)
    if 'mobile' in src:
        s=re.sub(r'\{\{prod:(.*?)\}\}',mprod,s)
        s=re.sub(r'\{\{card:(.*?)\}\}',card,s)
        s=s.replace('{{chev}}',CHEV)
    s=re.sub(r'\{\{prod:(.*?)\}\}',prod,s)
    s=re.sub(r'\{\{stars:(.*?)\}\}',lambda m:stars(m.group(1)),s)
    s=re.sub(r'\{\{img:(.*?)\}\}',img,s)
    out=src.replace('.src.html','.html'); open(out,'w').write(s); print(out,len(s))
