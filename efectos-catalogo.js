/* Efectos Catálogo Peñafiel — VERSIÓN 2
   Burbujas (fondo y frente), barra de avance, entrada de páginas,
   aros neón del color de cada marca, emojis con movimiento
   y emojis al tocar botones. */
(function(){
  'use strict';
  var d=document;

  function rnd(a,b){return a+Math.random()*(b-a);}

  /* ---------- 1) Burbujas y luces ---------- */
  function burbujas(capa,cuantas,tmin,tmax){
    for(var i=0;i<cuantas;i++){
      var b=d.createElement('i');
      var t=rnd(tmin,tmax);
      var dur=rnd(9,19);
      b.className='fxp-burbuja';
      b.style.width=t+'px';
      b.style.height=t+'px';
      b.style.left=rnd(0,97)+'%';
      b.style.animationDuration=dur+'s';
      b.style.animationDelay=(-rnd(0,dur))+'s';
      b.style.setProperty('--fxp-dx',(rnd(12,48)*(Math.random()<.5?-1:1))+'px');
      capa.appendChild(b);
    }
  }

  function crearFondo(){
    var fondo=d.createElement('div');
    fondo.className='fxp-fondo';
    fondo.setAttribute('aria-hidden','true');
    fondo.innerHTML='<i class="fxp-luz l1"></i><i class="fxp-luz l2"></i><i class="fxp-luz l3"></i>';
    burbujas(fondo,26,14,64);
    d.body.appendChild(fondo);

    var frente=d.createElement('div');
    frente.className='fxp-frente';
    frente.setAttribute('aria-hidden','true');
    burbujas(frente,10,8,28);
    d.body.appendChild(frente);
  }

  /* ---------- 2) Barra de avance ---------- */
  function barraAvance(){
    var prog=d.createElement('div');
    prog.className='fxp-progreso';
    prog.setAttribute('aria-hidden','true');
    prog.innerHTML='<i></i>';
    d.body.appendChild(prog);
    var barra=prog.firstChild,espera=false;
    function actualizar(){
      espera=false;
      var h=d.documentElement.scrollHeight-window.innerHeight;
      var p=h>0?Math.min(1,Math.max(0,window.pageYOffset/h)):0;
      barra.style.transform='scaleX('+p+')';
    }
    window.addEventListener('scroll',function(){
      if(!espera){espera=true;requestAnimationFrame(actualizar);}
    },{passive:true});
    actualizar();
  }

  /* ---------- 3) Páginas del catálogo: entran al verlas ---------- */
  function animarPaginas(){
    if(!('IntersectionObserver' in window))return;
    var vio=false;
    var io=new IntersectionObserver(function(entradas){
      vio=true;
      entradas.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('fxp-visto');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.05,rootMargin:'0px 0px -5% 0px'});

    function observar(){
      var paginas=d.querySelectorAll('.pe-pagina-catalogo:not([data-fxp])');
      for(var i=0;i<paginas.length;i++){
        paginas[i].setAttribute('data-fxp','1');
        io.observe(paginas[i]);
      }
    }

    d.documentElement.classList.add('fxp-anim');
    observar();
    window.addEventListener('load',observar);

    var contenedor=d.querySelector('.pe-catalogo-paginas');
    if(contenedor&&'MutationObserver' in window){
      new MutationObserver(observar).observe(contenedor,{childList:true,subtree:true});
    }

    /* Seguridad: si el observador no responde, se muestra todo */
    setTimeout(function(){
      if(vio)return;
      var todas=d.querySelectorAll('.pe-pagina-catalogo');
      for(var i=0;i<todas.length;i++)todas[i].classList.add('fxp-visto');
    },3500);
  }

  /* ---------- 4) Logos: aro neón con el color de cada marca ---------- */
  function colorDe(img){
    var c=d.createElement('canvas');
    c.width=c.height=32;
    var x=c.getContext('2d');
    x.drawImage(img,0,0,32,32);
    var p=x.getImageData(0,0,32,32).data;
    var r=0,g=0,b=0,w=0;
    for(var i=0;i<p.length;i+=4){
      if(p[i+3]<128)continue;
      var mx=Math.max(p[i],p[i+1],p[i+2]);
      var mn=Math.min(p[i],p[i+1],p[i+2]);
      if(mx<40||mn>225)continue;
      var s=mx-mn;
      if(s<35)continue;
      r+=p[i]*s;g+=p[i+1]*s;b+=p[i+2]*s;w+=s;
    }
    if(!w)return null;
    r=r/w;g=g/w;b=b/w;
    var lum=0.3*r+0.59*g+0.11*b;
    if(lum<110){r+=(255-r)*0.35;g+=(255-g)*0.35;b+=(255-b)*0.35;}
    return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';
  }

  function pintar(img){
    try{
      var col=colorDe(img);
      if(!col)return;
      img.style.setProperty('--marca',col);
      if(img.parentNode&&img.parentNode.classList&&img.parentNode.classList.contains('fxp-aro')){
        img.parentNode.style.setProperty('--marca',col);
      }
    }catch(e){/* si el navegador bloquea la lectura, queda el dorado */}
  }

  function aros(){
    var logos=d.querySelectorAll('.pe-logos-finales img');
    for(var i=0;i<logos.length;i++){
      (function(img){
        if(!img.parentNode||(img.parentNode.classList&&img.parentNode.classList.contains('fxp-aro')))return;
        var aro=d.createElement('span');
        aro.className='fxp-aro';
        img.parentNode.insertBefore(aro,img);
        aro.appendChild(img);
        if(img.complete&&img.naturalWidth)pintar(img);
        else img.addEventListener('load',function(){pintar(img);});
      })(logos[i]);
    }
  }

  /* ---------- 5) Emojis con movimiento ---------- */
  function emojis(){
    var RE=null,SOLO=/^[\u00A9\u00AE\u2122]\uFE0F?$/,n=0;
    try{
      RE=new RegExp('(?:\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic}|\\p{Emoji_Modifier})*)','gu');
    }catch(e){return;}

    function permitido(el){
      if(!el||!el.closest)return false;
      return !el.closest('.fxp-emoji,.fxp-aro,.fxp-fondo,.fxp-frente,script,style,video,#pe-hora,#pe-fecha,.pe-flecha');
    }

    function envolver(nodo){
      if(nodo.nodeType!==3||!nodo.parentNode||!permitido(nodo.parentNode))return;
      var txt=nodo.nodeValue;
      if(!txt)return;
      RE.lastIndex=0;
      var frag=d.createDocumentFragment(),ult=0,m,hubo=false;
      while((m=RE.exec(txt))){
        if(SOLO.test(m[0]))continue;
        hubo=true;
        if(m.index>ult)frag.appendChild(d.createTextNode(txt.slice(ult,m.index)));
        var s=d.createElement('span');
        s.className='fxp-emoji'+(n%3===1?' b':n%3===2?' c':'');
        n++;
        s.style.animationDelay=(-Math.random()*2)+'s';
        s.textContent=m[0];
        frag.appendChild(s);
        ult=m.index+m[0].length;
      }
      if(!hubo)return;
      if(ult<txt.length)frag.appendChild(d.createTextNode(txt.slice(ult)));
      nodo.parentNode.replaceChild(frag,nodo);
    }

    function barrer(raiz){
      if(!raiz||(raiz.nodeType===1&&!permitido(raiz)))return;
      var w=d.createTreeWalker(raiz,NodeFilter.SHOW_TEXT,null,false);
      var lista=[],t;
      while((t=w.nextNode()))lista.push(t);
      for(var i=0;i<lista.length;i++)envolver(lista[i]);
    }

    function procesar(nodo){
      if(nodo.nodeType===3)envolver(nodo);
      else if(nodo.nodeType===1)barrer(nodo);
    }

    var zona=d.querySelector('.pe-contenido')||d.body;
    barrer(zona);

    if(!('MutationObserver' in window))return;
    var cola=[],pendiente=false;
    function vaciar(){
      pendiente=false;
      var lote=cola;cola=[];
      for(var i=0;i<lote.length;i++){
        if(lote[i].parentNode||lote[i]===zona)procesar(lote[i]);
      }
    }
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var mu=muts[i];
        if(mu.type==='characterData')cola.push(mu.target);
        else for(var j=0;j<mu.addedNodes.length;j++)cola.push(mu.addedNodes[j]);
      }
      if(cola.length&&!pendiente){pendiente=true;requestAnimationFrame(vaciar);}
    }).observe(zona,{childList:true,characterData:true,subtree:true});
  }

  /* ---------- 6) Emojis al tocar botones ---------- */
  function toques(){
    if(!Element.prototype.animate)return;
    var lista=['🫧','💧','✨','💙','⭐'];
    function explosion(x,y){
      for(var i=0;i<12;i++){
        var s=d.createElement('span');
        s.className='fxp-chispa';
        s.textContent=lista[Math.floor(Math.random()*lista.length)];
        s.style.left=x+'px';
        s.style.top=y+'px';
        d.body.appendChild(s);
        var ang=Math.random()*Math.PI*2;
        var dist=60+Math.random()*80;
        var dx=Math.cos(ang)*dist;
        var dy=Math.sin(ang)*dist-50;
        var giro=Math.random()*360-180;
        var anim=s.animate([
          {transform:'translate(-50%,-50%) scale(.4)',opacity:1},
          {transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) scale(1.3) rotate('+giro+'deg)',opacity:0}
        ],{duration:750+Math.random()*350,easing:'cubic-bezier(.2,.8,.3,1)'});
        anim.onfinish=(function(el){return function(){el.remove();};})(s);
      }
    }
    d.addEventListener('pointerdown',function(e){
      var t=e.target.closest&&e.target.closest('.pe-descarga-pdf a,.pe-whatsapp a,.pe-boton-carrusel,.pe-banner');
      if(t)explosion(e.clientX,e.clientY);
    },{passive:true});
  }

  function iniciar(){
    crearFondo();
    barraAvance();
    animarPaginas();
    aros();
    emojis();
    toques();
  }

  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',iniciar);
  else iniciar();
})();
