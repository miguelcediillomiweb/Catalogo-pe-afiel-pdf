/* Efectos Catálogo Peñafiel
   Crea la capa de burbujas, anima la entrada de las páginas,
   saca el color de cada logo y lanza emojis al tocar botones. */
(function(){
  'use strict';
  var d=document;
  function rnd(a,b){return a+Math.random()*(b-a);}

  function crearFondo(){
    var capa=d.createElement('div');
    capa.className='fxp-fondo';
    capa.setAttribute('aria-hidden','true');
    capa.innerHTML='<i class="fxp-luz l1"></i><i class="fxp-luz l2"></i>';
    for(var i=0;i<14;i++){
      var b=d.createElement('i'),t=rnd(10,44),dur=rnd(9,18);
      b.className='fxp-burbuja';b.style.width=t+'px';b.style.height=t+'px';
      b.style.left=rnd(0,97)+'%';b.style.animationDuration=dur+'s';
      b.style.animationDelay=(-rnd(0,dur))+'s';
      b.style.setProperty('--fxp-dx',(rnd(10,40)*(Math.random()<.5?-1:1))+'px');
      capa.appendChild(b);
    }
    d.body.appendChild(capa);
  }

  function animarPaginas(){
    if(!('IntersectionObserver' in window))return;
    var vio=false;
    var io=new IntersectionObserver(function(entradas){
      vio=true;
      entradas.forEach(function(e){if(e.isIntersecting){e.target.classList.add('fxp-visto');io.unobserve(e.target);}});
    },{threshold:0.05,rootMargin:'0px 0px -5% 0px'});
    function observar(){
      var paginas=d.querySelectorAll('.pe-pagina-catalogo:not([data-fxp])');
      for(var i=0;i<paginas.length;i++){paginas[i].setAttribute('data-fxp','1');io.observe(paginas[i]);}
    }
    d.documentElement.classList.add('fxp-anim');observar();window.addEventListener('load',observar);
    var contenedor=d.querySelector('.pe-catalogo-paginas');
    if(contenedor&&'MutationObserver' in window)new MutationObserver(observar).observe(contenedor,{childList:true,subtree:true});
    setTimeout(function(){if(vio)return;var todas=d.querySelectorAll('.pe-pagina-catalogo');for(var i=0;i<todas.length;i++)todas[i].classList.add('fxp-visto');},3500);
  }

  function colorDe(img){
    var c=d.createElement('canvas');c.width=c.height=32;
    var x=c.getContext('2d');x.drawImage(img,0,0,32,32);
    var p=x.getImageData(0,0,32,32).data,r=0,g=0,b=0,w=0;
    for(var i=0;i<p.length;i+=4){
      if(p[i+3]<128)continue;
      var mx=Math.max(p[i],p[i+1],p[i+2]),mn=Math.min(p[i],p[i+1],p[i+2]);
      if(mx<40||mn>225)continue;
      var s=mx-mn;if(s<35)continue;r+=p[i]*s;g+=p[i+1]*s;b+=p[i+2]*s;w+=s;
    }
    if(!w)return null;r/=w;g/=w;b/=w;
    var lum=.3*r+.59*g+.11*b;
    if(lum<110){r+=(255-r)*.35;g+=(255-g)*.35;b+=(255-b)*.35;}
    return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';
  }
  function pintar(img){try{var col=colorDe(img);if(col)img.style.setProperty('--marca',col);}catch(e){}}
  function colorearLogos(){
    var logos=d.querySelectorAll('.pe-logos-finales img');
    for(var i=0;i<logos.length;i++)(function(img){if(img.complete&&img.naturalWidth)pintar(img);else img.addEventListener('load',function(){pintar(img);});})(logos[i]);
  }
  function activarToques(){
    if(!Element.prototype.animate)return;
    var emojis=['🫧','💧','✨','💙'];
    function explosion(x,y){
      for(var i=0;i<9;i++){
        var s=d.createElement('span');s.className='fxp-chispa';s.textContent=emojis[Math.floor(Math.random()*emojis.length)];
        s.style.left=x+'px';s.style.top=y+'px';d.body.appendChild(s);
        var ang=Math.random()*Math.PI*2,dist=50+Math.random()*70,dx=Math.cos(ang)*dist,dy=Math.sin(ang)*dist-40,giro=Math.random()*360-180;
        var anim=s.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) scale(1.2) rotate('+giro+'deg)',opacity:0}],{duration:700+Math.random()*300,easing:'cubic-bezier(.2,.8,.3,1)'});
        anim.onfinish=(function(el){return function(){el.remove();};})(s);
      }
    }
    d.addEventListener('pointerdown',function(e){var t=e.target.closest&&e.target.closest('.pe-descarga-pdf a,.pe-whatsapp a,.pe-boton-carrusel');if(t)explosion(e.clientX,e.clientY);},{passive:true});
  }
  function iniciar(){crearFondo();animarPaginas();colorearLogos();activarToques();}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
