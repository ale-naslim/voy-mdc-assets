(function(){
  var sec = document.getElementById('nu-hero');
  if(!sec) return;
  var v = sec.querySelector('video.bg-video');
  var mq = window.matchMedia('(max-width:900px)');
  var FONTES = { dk:['https://cdn.jsdelivr.net/gh/ale-naslim/voy-mdc-assets@main/assets/video/header-bento-curto.258fbf08.mp4','https://cdn.jsdelivr.net/gh/ale-naslim/voy-mdc-assets@main/assets/img/header-bento-curto-poster.3bd4a145.webp'],
                 mb:['https://cdn.jsdelivr.net/gh/ale-naslim/voy-mdc-assets@main/assets/video/header-bento-9x16-curto.f4816175.mp4','https://cdn.jsdelivr.net/gh/ale-naslim/voy-mdc-assets@main/assets/img/header-bento-9x16-curto-poster.b1d5d054.webp'] };
  function depoisDoLoad(fn){ if(document.readyState === 'complete') fn(); else window.addEventListener('load', fn, {once:true}); }
  function tocar(){ if(!v || !v.getAttribute('src')) return; var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  
  var liberado = false;
  function redeRuim(){
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if(!c) return false;
    if(c.saveData) return true;
    return /(^|-)2g$/.test(c.effectiveType || '');
  }
  function fonte(){ return mq.matches ? FONTES.mb : FONTES.dk; }
  function escolher(){
    if(!v) return;
    var f = fonte();
    if(v.getAttribute('poster') !== f[1]) v.setAttribute('poster', f[1]);
    if(!liberado) return;
    if(v.getAttribute('src') !== f[0]){ v.setAttribute('src', f[0]); v.load(); }
    if(sec.classList.contains('is-in')) tocar();
  }
  escolher();
  depoisDoLoad(function(){ if(redeRuim()) return; liberado = true; escolher(); });
  if(mq.addEventListener) mq.addEventListener('change', escolher); else if(mq.addListener) mq.addListener(escolher);
  
  function entrar(){ sec.classList.add('is-in'); setTimeout(function(){ depoisDoLoad(tocar); }, 1100); }
  var pronto = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var deu = false; function uma(){ if(deu) return; deu = true; requestAnimationFrame(function(){ requestAnimationFrame(entrar); }); }
  pronto.then(uma).catch(uma); setTimeout(uma, 900);   
  if('IntersectionObserver' in window && v){
    new IntersectionObserver(function(es){ var on = es[es.length-1].isIntersecting; if(on){ if(sec.classList.contains('is-in')) depoisDoLoad(tocar); } else v.pause(); },{rootMargin:'120px 0px'}).observe(sec);
  }
})();
;
(function(){
  var sec = document.getElementById('nu-depo'); if(!sec) return;
  var trilha = sec.querySelector('.trilha'), cards = [].slice.call(sec.querySelectorAll('.nu-card'));
  var vids = cards.filter(function(c){ return c.classList.contains('nu-card--video'); });
  var ant = sec.querySelector('.seta-ant'), prox = sec.querySelector('.seta-prox');
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  
  if('IntersectionObserver' in window){
    var perto = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(!e.isIntersecting) return;
        var v = e.target.querySelector('video'); if(v && v.dataset.poster){ v.poster = v.dataset.poster; delete v.dataset.poster; }
        [].forEach.call(e.target.querySelectorAll('img[data-src]'), function(im){ im.src = im.dataset.src; im.removeAttribute('data-src'); });
        perto.unobserve(e.target); });
    },{rootMargin:'600px 500px'});
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ var v = e.target.querySelector('video'); if(!v) return;
        if(e.isIntersecting){ if(v.preload === 'none') v.preload = 'auto'; if(!reduz){ var p = v.play(); if(p && p.catch) p.catch(function(){}); } }
        else { try{ v.pause(); }catch(err){} } });
    },{threshold:.35});
    vids.forEach(function(c){ io.observe(c); });
    [].forEach.call(sec.querySelectorAll('.nu-card'), function(c){ perto.observe(c); });
  }
  
  function silenciar(){ vids.forEach(function(o){ var ov = o.querySelector('video'); ov.muted = true; o.classList.remove('com-som'); var b = o.querySelector('.som'); if(b) b.setAttribute('aria-label','Ativar o som'); }); }
  vids.forEach(function(c){
    var v = c.querySelector('video'), bt = c.querySelector('.som'); if(!bt) return;
    bt.addEventListener('click', function(e){
      e.stopPropagation();
      var ligar = v.muted; silenciar();
      if(ligar){ v.muted = false; c.classList.add('com-som'); bt.setAttribute('aria-label','Silenciar'); var t = v.play(); if(t && t.catch) t.catch(function(){}); }
    });
  });
  
  function passo(){ var c = cards[0]; return c ? c.getBoundingClientRect().width + 24 : 400; }
  function estado(){ if(!ant || !prox) return; var max = trilha.scrollWidth - trilha.clientWidth - 2; ant.disabled = trilha.scrollLeft <= 2; prox.disabled = trilha.scrollLeft >= max; }
  if(ant) ant.addEventListener('click', function(){ trilha.scrollBy({left:-passo(), behavior:'smooth'}); });
  if(prox) prox.addEventListener('click', function(){ trilha.scrollBy({left:passo(), behavior:'smooth'}); });
  trilha.addEventListener('scroll', estado, {passive:true}); window.addEventListener('resize', estado); estado();
  
  var lb = document.getElementById('nu-lb'), miolo = lb && lb.querySelector('.lb-miolo'), fechaBt = lb && lb.querySelector('.lb-x');
  if(lb && lb.parentElement !== document.body) document.body.appendChild(lb);
  function fechar(){
    if(!lb || lb.hidden) return;
    var v = miolo.querySelector('video'); if(v){ try{ v.pause(); }catch(err){} }
    miolo.innerHTML = ''; lb.hidden = true; document.documentElement.style.overflow = ''; document.body.classList.remove('nu-lb-aberto');
  }
  function abrir(cel){
    if(!lb) return;
    miolo.innerHTML = '';
    if(cel.classList.contains('nu-card--video')){
      var src = cel.querySelector('video'), v = document.createElement('video');
      v.src = src.getAttribute('src'); v.poster = src.getAttribute('poster') || src.getAttribute('data-poster') || '';
      v.controls = true; v.autoplay = true; v.muted = false; v.setAttribute('playsinline','');
      miolo.appendChild(v); silenciar();
      var t = v.play(); if(t && t.catch) t.catch(function(){});
    } else {
      var fig = document.createElement('figure'); fig.className = 'lb-par';
      [].forEach.call(cel.querySelectorAll('.lado img'), function(im){ var i = document.createElement('img'); i.src = im.getAttribute('src') || im.getAttribute('data-src'); i.alt = im.getAttribute('alt') || ''; fig.appendChild(i); });
      var cr = cel.querySelector('.credito'); if(cr){ var cap = document.createElement('figcaption'); cap.innerHTML = cr.innerHTML; fig.appendChild(cap); }
      miolo.appendChild(fig);
    }
    lb.hidden = false; document.documentElement.style.overflow = 'hidden'; document.body.classList.add('nu-lb-aberto');
    if(fechaBt) fechaBt.focus();
  }
  cards.forEach(function(c){
    c.addEventListener('click', function(e){ if(e.target.closest && e.target.closest('.som')) return; abrir(c); });
    c.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); abrir(c); } });
  });
  if(lb){
    fechaBt.addEventListener('click', fechar);
    lb.addEventListener('click', function(e){ if(e.target === lb) fechar(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') fechar(); });
  }
})();
;
(function(){
  var s = document.getElementById('nu-marquee');
  if (!s) return;
  var tracks = s.querySelectorAll('.nu-marquee__track');
  if (!tracks.length) return;
  var FACES = ['nathalie','aline','sarah','rebeca','leticia','roberta','kelly','lene'];
  
  function montar(){
    for (var i = 0; i < tracks.length; i++){
      var tr = tracks[i];
      if (tr.getAttribute('data-montado')) continue;
      var grupos = tr.querySelectorAll('.nu-marquee__group');
      if (grupos.length !== 2) continue;
      var molde = grupos[0].querySelector('.nu-marquee__unit');
      if (!molde) continue;
      var img = molde.querySelector('img'), src = molde.querySelector('source');
      if (!img) continue;
      var urlImg = img.getAttribute('data-src') || img.getAttribute('src') || '';
      var urlSrc = src ? (src.getAttribute('srcset') || '') : '';
      var atual = (urlImg.match(/loop-([a-z]+)\.webp/) || [,''])[1];
      if (!atual) continue;
      var off = FACES.indexOf(atual); if (off < 0) off = 0;
      for (var g = 0; g < 2; g++){
        grupos[g].innerHTML = '';
        for (var k = 0; k < FACES.length; k++){
          var f = FACES[(off + k) % FACES.length];
          var u = molde.cloneNode(true);
          var ui = u.querySelector('img'), us = u.querySelector('source');
          if (ui) ui.setAttribute('data-src', urlImg.replace('loop-' + atual, 'loop-' + f));
          if (us && urlSrc) us.setAttribute('srcset', urlSrc.replace('rosto-' + atual, 'rosto-' + f));
          grupos[g].appendChild(u);
        }
      }
      tr.setAttribute('data-montado','1');
    }
  }
  
  function acender(){
    var imgs = s.querySelectorAll('img[data-src]');
    for (var i = 0; i < imgs.length; i++){
      imgs[i].setAttribute('src', imgs[i].getAttribute('data-src'));
      imgs[i].removeAttribute('data-src');
    }
  }
  if ('IntersectionObserver' in window){
    var perto = new IntersectionObserver(function(es){
      if (es[es.length-1].isIntersecting){ acender(); perto.disconnect(); }
    }, {rootMargin:'700px 0px'});
    perto.observe(s);
  } else { acender(); }
  function largura(){ return window.innerWidth || document.documentElement.clientWidth || 1440; }
  
  function preencher(){
    var alvo = largura() * 1.15;
    for (var i = 0; i < tracks.length; i++){
      var grupos = tracks[i].querySelectorAll('.nu-marquee__group');
      if (grupos.length !== 2) continue;
      var g1 = grupos[0], g2 = grupos[1];
      var base = g1.querySelectorAll('.nu-marquee__unit');
      if (!base.length) continue;
      var guarda = 0;
      while (g1.getBoundingClientRect().width < alvo && guarda < 16){
        g1.appendChild(base[guarda % base.length].cloneNode(true));
        g2.appendChild(base[guarda % base.length].cloneNode(true));
        guarda++;
      }
    }
  }
  
  var LEITURA = 14;
  function ritmo(){
    var tela = largura();
    for (var i = 0; i < tracks.length; i++){
      var g = tracks[i].querySelector('.nu-marquee__group');
      var u = g && g.querySelector('.nu-marquee__unit');
      if (!g || !u) continue;
      var lgGrupo = g.getBoundingClientRect().width;
      var lgUnid  = u.getBoundingClientRect().width;
      if (lgGrupo < 10 || lgUnid < 10) continue;
      var dur = lgGrupo * LEITURA / (lgUnid + tela);
      tracks[i].style.setProperty('--dur', dur.toFixed(1) + 's');
    }
  }
  try { montar(); preencher(); ritmo(); } catch (e) {}
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ try { preencher(); ritmo(); } catch (e) {} });
  var t = null;
  window.addEventListener('resize', function(){
    if (t) clearTimeout(t);
    t = setTimeout(function(){ try { preencher(); ritmo(); } catch (e) {} }, 250);
  }, { passive: true });
})();
;
(function(){
  var sec = document.getElementById('nu-trilho');
  if(!sec) return;
  var palco = sec.querySelector('.palco');
  var rail  = sec.querySelector('.rail');
  var pains = Array.prototype.slice.call(sec.querySelectorAll('.painel'));
  var abas  = Array.prototype.slice.call(sec.querySelectorAll('.aba'));
  var barra = sec.querySelector('.barra > i');
  var btPrev = sec.querySelector('.cn-prev'), btNext = sec.querySelector('.cn-next');
  var dots   = Array.prototype.slice.call(sec.querySelectorAll('.cn-dot'));
  var modo = 'rail', caixaH = 0, ultimoY = null, cardAtivo = -1;   
  if(!palco || !rail || !pains.length) return;
  
  var PACE_DK = 2.4583;  
  var PACE_MB = 1.923;   
  var PACE    = PACE_DK;
  var F_ARTE  = 1.77;   
  var F_TEXTO = 0.92;   
  var F_NUM   = 0.10;   
  var LIM     = 56;     
  var mqMob = window.matchMedia('(max-width:900px)');
  var mqRed = window.matchMedia('(prefers-reduced-motion:reduce)');
  var camadas = pains.map(function(p){
    return {
      arte: p.querySelector('.painel-arte'),
      copy: p.querySelector('.painel-copy'),
      num : p.querySelector('.num')
    };
  });
  var live=false, visivel=true, rafId=0;
  var y = window.pageYOffset || document.documentElement.scrollTop || 0;
  var topo=0, vh=0, stageW=0, travel=0, altura=0, padL=0;
  var lefts=[], centros=[], ultimoN=-1, ultimoIdx=-1;
  function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
  
  var parados = 0;
  function onScroll(){ parados = 0; ligarLoop(); }
  function limparCards(){
    for(var i=0;i<pains.length;i++){ pains[i].style.transform=''; if(camadas[i].arte) camadas[i].arte.style.transform=''; }
    ultimoY=null; cardAtivo=-1;
  }
  function marcarCard(i){
    if(i===cardAtivo) return;
    cardAtivo=i;
    for(var k=0;k<dots.length;k++){ if(k===i) dots[k].classList.add('on'); else dots[k].classList.remove('on'); }
    if(btPrev) btPrev.disabled = (i<=0);
    if(btNext) btNext.disabled = (i>=pains.length-1);
  }
  function irPara(i){
    i = clamp(i,0,pains.length-1);
    window.scrollTo({top:Math.round(topo + i*vh), behavior:'smooth'});
  }
  function desligar(){
    live=false;
    sec.classList.remove('nu-live'); sec.classList.remove('nu-cards'); limparCards();
    sec.style.height='';
    rail.style.transform='';
    camadas.forEach(function(c){
      if(c.arte) c.arte.style.transform='';
      if(c.copy) c.copy.style.transform='';
      if(c.num)  c.num.style.transform='';
    });
    if(barra) barra.style.transform='scaleX(0)';
    ultimoN=-1; ultimoIdx=-1;
    if(rafId){ cancelAnimationFrame(rafId); rafId=0; }
  }
  function marcarAba(i){
    if(i===ultimoIdx) return;
    ultimoIdx=i;
    for(var k=0;k<abas.length;k++){
      if(k===i) abas[k].setAttribute('aria-current','true');
      else abas[k].removeAttribute('aria-current');
    }
  }
  function aplicar(){
    if(!live) return false;
    if(modo==='cards'){
      var yy = y - topo, ky = Math.round(yy);
      if(ky===ultimoY) return false;
      ultimoY = ky;
      var prog = vh>0 ? yy/vh : 0;
      for(var i=0;i<pains.length;i++){
        var t = caixaH * clamp(i - prog, 0, i);
        pains[i].style.transform = 'translate3d(0,' + t.toFixed(1) + 'px,0)';
        if(camadas[i].arte) camadas[i].arte.style.transform = 'translate3d(0,' + (t*0.26).toFixed(1) + 'px,0)';
      }
      marcarCard(clamp(Math.round(prog),0,pains.length-1));
      return true;
    }
    var den = altura - vh;
    var p = den>0 ? (y - topo)/den : 0;
    p = clamp(p,0,1);
    var N = p * travel;
    if(N === ultimoN) return false;
    ultimoN = N;
    rail.style.transform = 'translate3d(' + (-N) + 'px,0,0)';
    for(var i=0;i<camadas.length;i++){
      var dc = N - centros[i];                       
      var c = camadas[i];
      if(c.arte) c.arte.style.transform = 'translate3d(' + clamp((1-F_ARTE)*dc,-LIM,LIM) + 'px,0,0)';
      if(c.copy) c.copy.style.transform = 'translate3d(' + clamp((1-F_TEXTO)*dc,-LIM,LIM) + 'px,0,0)';
      if(c.num)  c.num.style.transform  = 'translate3d(' + clamp(F_NUM*dc,-LIM*0.5,LIM*0.5) + 'px,0,0)';
    }
    if(barra) barra.style.transform = 'scaleX(' + p + ')';
    var ativo = 0;
    for(var j=0;j<lefts.length;j++){ if(N >= lefts[j] - stageW*0.45) ativo = j; }
    marcarAba(ativo);
    return true;
  }
  function loop(){
    if(!live || !visivel){ rafId=0; return; }
    y = window.pageYOffset || document.documentElement.scrollTop || 0;  
    var mudou = aplicar();
    parados = mudou ? 0 : parados + 1;
    if(parados > 3){ rafId = 0; return; }
    rafId = requestAnimationFrame(loop);
  }
  function ligarLoop(){ if(live && visivel && !rafId){ parados = 0; rafId = requestAnimationFrame(loop); } }
  function medir(){
    if(mqRed.matches){ desligar(); return; }   
    try{
      sec.classList.add('nu-live');
      live = true;
      if(mqMob.matches){
        modo = 'cards'; sec.classList.add('nu-cards');
        rail.style.transform = '';
        camadas.forEach(function(c){ if(c.copy) c.copy.style.transform=''; });
        vh     = Math.round(palco.getBoundingClientRect().height) || window.innerHeight;
        caixaH = Math.round(rail.getBoundingClientRect().height) || (vh - 151);
        altura = vh * pains.length;                       
        sec.style.height = altura + 'px';
        topo = sec.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
        ultimoN=-1; ultimoY=null;
        onScroll(); aplicar(); ligarLoop();
        return;
      }
      if(modo==='cards'){ limparCards(); }
      modo = 'rail'; sec.classList.remove('nu-cards');
      vh     = Math.round(palco.getBoundingClientRect().height) || window.innerHeight;
      stageW = palco.clientWidth;
      padL   = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      var ult  = pains[pains.length-1];
      var padR = parseFloat(getComputedStyle(rail).paddingRight) || 0;
      var railW = Math.max(rail.scrollWidth, ult.offsetLeft + ult.offsetWidth + padR);
      
      travel = Math.max(0, Math.min(railW - stageW, ult.offsetLeft - padL));
      if(travel <= 0 || !isFinite(travel)){ desligar(); return; }
      PACE = mqMob.matches ? PACE_MB : PACE_DK;
      altura = Math.round(vh + travel * PACE);
      sec.style.height = altura + 'px';
      topo = sec.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      lefts=[]; centros=[];
      for(var i=0;i<pains.length;i++){
        var l = pains[i].offsetLeft;
        lefts[i]   = l;
        centros[i] = l + pains[i].offsetWidth/2 - stageW/2;
      }
      
      var c0 = camadas[0];
      var gExt = parseFloat(getComputedStyle(rail).columnGap) || 0;
      var gInt = (c0.copy && c0.arte)
        ? (c0.arte.offsetLeft - c0.copy.offsetLeft - c0.copy.offsetWidth)
        : gExt;
      LIM = 170;   
      ultimoN=-1;
      onScroll();
      aplicar();
      ligarLoop();
    }catch(e){
      desligar();
    }
  }
  
  if(btPrev) btPrev.addEventListener('click', function(){ irPara(cardAtivo-1); });
  if(btNext) btNext.addEventListener('click', function(){ irPara(cardAtivo+1); });
  dots.forEach(function(d,i){ d.addEventListener('click', function(){ irPara(i); }); });
  
  abas.forEach(function(b,i){
    b.addEventListener('click', function(){
      if(!live || travel<=0){
        if(pains[i].scrollIntoView) pains[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
        return;
      }
      var Ni   = clamp(lefts[i] - padL, 0, travel);
      var alvo = topo + (Ni/travel) * (altura - vh);
      window.scrollTo({top:Math.round(alvo), behavior:'smooth'});
    });
  });
  
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(ents){
      visivel = ents[ents.length-1].isIntersecting;   
      if(visivel) ligarLoop();
    },{rootMargin:'300px 0px'}).observe(sec);
  }
  var tid=0;
  function remedir(){ clearTimeout(tid); tid = setTimeout(medir, 150); }
  
  palco.addEventListener('scroll', function(){
    if(palco.scrollLeft){ palco.scrollLeft = 0; }
    if(palco.scrollTop){ palco.scrollTop = 0; }
  }, {passive:true});
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', remedir);
  window.addEventListener('orientationchange', remedir);
  window.addEventListener('load', remedir);
  if(mqMob.addEventListener){ mqMob.addEventListener('change', remedir); mqRed.addEventListener('change', remedir); }
  else if(mqMob.addListener){ mqMob.addListener(remedir); mqRed.addListener(remedir); }
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(remedir).catch(function(){});
  medir();
})();
;
(function(){  })();
;
(function(){  })();
;
(function(){
  var reg = document.getElementById('nu-reg');
  if(!reg) return;
  var folha = reg.querySelector('.rg-folha');
  var corpo = reg.querySelector('.rg-corpo');
  var fecha = reg.querySelector('.rg-x');
  if(reg.parentElement !== document.body) document.body.appendChild(reg);
  var voltarPara = null;
  function abrir(origem){
    voltarPara = origem || null;
    reg.hidden = false;
    corpo.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ reg.classList.add('is-aberto'); }); });
    setTimeout(function(){ try { fecha.focus(); } catch(e){} }, 60);
  }
  function fecharModal(){
    if(reg.hidden) return;
    reg.classList.remove('is-aberto');
    document.documentElement.style.overflow = '';
    var fim = function(){ reg.hidden = true; };
    if(matchMedia('(prefers-reduced-motion:reduce)').matches) fim(); else setTimeout(fim, 260);
    if(voltarPara){ try { voltarPara.focus(); } catch(e){} voltarPara = null; }
  }
  fecha.addEventListener('click', fecharModal);
  reg.addEventListener('click', function(e){ if(e.target === reg) fecharModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') fecharModal(); });
  
  reg.addEventListener('keydown', function(e){
    if(e.key !== 'Tab') return;
    var foca = folha.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!foca.length) return;
    var pri = foca[0], ult = foca[foca.length - 1];
    if(e.shiftKey && document.activeElement === pri){ e.preventDefault(); ult.focus(); }
    else if(!e.shiftKey && document.activeElement === ult){ e.preventDefault(); pri.focus(); }
  });
  
  [].forEach.call(document.querySelectorAll('[data-nu-reg]'), function(bt){
    bt.addEventListener('click', function(e){ e.preventDefault(); abrir(bt); });
  });
})();
;
(function(){
  
  var reduz = matchMedia('(prefers-reduced-motion:reduce)').matches;
  
  if('IntersectionObserver' in window){
    var grupos = document.querySelectorAll('[data-nu-reveal-group]');
    grupos.forEach(function(g){
      [].slice.call(g.querySelectorAll('[data-nu-reveal]')).forEach(function(el,i){ el.style.setProperty('--nu-i', i); });
    });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    },{threshold:.12, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('[data-nu-reveal]').forEach(function(el){ io.observe(el); });
    setTimeout(function(){ document.querySelectorAll('[data-nu-reveal]:not(.is-in)').forEach(function(el){
      var r=el.getBoundingClientRect(); if(r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); }); }, 2500);
  } else {
    document.querySelectorAll('[data-nu-reveal]').forEach(function(el){ el.classList.add('is-in'); });
  }
  if(reduz) return;
  
  var drifts = [].slice.call(document.querySelectorAll('[data-nu-drift]'));
  var vpars  = [].slice.call(document.querySelectorAll('[data-nu-vpar]'));
  var raf = 0, sujo = true;
  function prog(r, vh){ 
    return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
  }
  function aplicar(){
    var vh = innerHeight;
    drifts.forEach(function(el){
      var r = el.getBoundingClientRect(); if(r.bottom < 0 || r.top > vh) return;
      var amp = parseFloat(el.getAttribute('data-nu-drift')) || 33;   
      var alvo = (prog(r,vh) - .5) * -amp;
      if(el.hasAttribute('data-nu-mola')){
        var st = el.__mola || (el.__mola = {p:alvo, v:0});
        var k = 0.045, d = 0.88;
        st.v = st.v * d + (alvo - st.p) * k; st.p += st.v;
        if(Math.abs(alvo - st.p) > 0.05 || Math.abs(st.v) > 0.05) sujo = true;
        el.style.transform = 'translate3d(0,' + st.p.toFixed(2) + 'px,0)';
      } else {
        el.style.transform = 'translate3d(0,' + alvo.toFixed(2) + 'px,0)';
      }
    });
    vpars.forEach(function(el){
      var r = el.getBoundingClientRect(); if(r.bottom < 0 || r.top > vh) return;
      var amp = parseFloat(el.getAttribute('data-nu-vpar')) || 100;   
      var m = el.querySelector('img,video'); if(!m) return;
      m.style.transform = 'translate3d(0,' + ((prog(r,vh) - .5) * amp).toFixed(2) + 'px,0) scale(1.14)';
    });
  }
  function loop(){ raf = 0; if(sujo){ sujo = false; aplicar(); if(sujo) raf = requestAnimationFrame(loop); } }
  function pedir(){ sujo = true; if(!raf) raf = requestAnimationFrame(loop); }
  addEventListener('scroll', pedir, {passive:true});
  addEventListener('resize', pedir);
  addEventListener('load', pedir);
  pedir();
})();
;
(function(){
  var fl = document.getElementById('nu-float'); if(!fl) return;
  var SEL = 'a.cta, a.botao, button.botao, a.ofr-cta, a.ft-cta, a.nav-cta, #nu-numeros .cta';
  function ligar(){
    var ctas = [].slice.call(document.querySelectorAll(SEL)).filter(function(e){ return e!==fl; });
    if(!ctas.length || !('IntersectionObserver' in window)) return;
    var visiveis = new Set();
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target); });
      var on = visiveis.size === 0;
      fl.classList.toggle('is-on', on);
      fl.setAttribute('aria-hidden', on ? 'false' : 'true');
      fl.tabIndex = on ? 0 : -1;
    },{threshold:.2});
    ctas.forEach(function(c){ io.observe(c); });
  }
  if(document.readyState === 'complete') ligar(); else addEventListener('load', ligar);
})();
;
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var SEL = '#nu-trilho .arte-foto, #nu-oferta .ofr-arte img, #nu-carrossel .foto img';
  var alvos = [], raf = 0, sujo = true;
  function montar(){
    alvos = [].slice.call(document.querySelectorAll(SEL));
    alvos.forEach(function(img){
      var caixa = img.parentElement;
      if(caixa && !caixa.classList.contains('nu-zoom')) caixa.classList.add('nu-zoom');
    });
  }
  function aplicar(){
    var vh = innerHeight;
    for(var i=0;i<alvos.length;i++){
      var img = alvos[i], r = img.getBoundingClientRect();
      if(r.bottom < -200 || r.top > vh + 200) continue;
      var p = 1 - Math.min(1, Math.max(0, (r.top + r.height*0.5 - vh*0.5) / (vh*0.75)));
      img.style.transform = 'scale(' + (1 + 0.06 * (1 - p)).toFixed(4) + ')';
    }
  }
  function loop(){ raf = 0; if(sujo){ sujo = false; aplicar(); } }
  function pedir(){ sujo = true; if(!raf) raf = requestAnimationFrame(loop); }
  addEventListener('scroll', pedir, {passive:true});
  addEventListener('resize', function(){ montar(); pedir(); });
  addEventListener('load', function(){ montar(); pedir(); });
  montar(); pedir();
})();