
(function(){
'use strict';

/* ============================================================
   STATE GLOBAL
   ============================================================ */
var S = {
  tab:'home', ob:0,
  obData:{name:'', sex:'', age:25, country:'SN', phone:'', stylePref:'', budget:20000, colors:[]},
  prof:{name:'', sex:'', age:25, country:'SN', photo:null, style:'', budget:20000, colors:[], address:'', email:'', bio:''},
  cold:{
    phase:0, interactions:0,
    signals:{views:0,likes:0,saves:0,purchases:0,videoLikes:0,taps:0},
    inferred:{categories:{}, colors:{}, avgPrice:0, priceHits:[]}
  },
  gift:{points:0, history:[], totalSent:0, badges:[]},
  likedProducts:[], savedProducts:[], cart:[], orders:[],
  shopGender:null, filterCat:'all',
  libraryTab:0,
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
  socialEvents:[], selectedDay:null,
  friends:[], friendRequests:[],
  chats:{},
  challengeEntries:[],
  mystery:{revealed:false, votes:0},
  notifications:[],
  settings:{
    language:'fr',
    notifications:{prayers:true, events:true, trends:true, orders:true, messages:true, friends:true},
    privacy:{publicProfile:true, showLocation:true, showStats:true, showDressing:false, allowMessages:'everyone'}
  },
  stats:{profileViews:0, videoViews:0, sharedPosts:0, giftsReceived:0}
};
S.prof.sex = 'H';
S.shopGender = 'H';

function $(s){ return document.querySelector(s); }
function $$(s){ return document.querySelectorAll(s); }
function cfa(e){ return Math.round(e * 655.96).toLocaleString('fr-FR') + ' FCFA'; }
function now(){ var d = new Date(); return (d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes(); }
function imgTag(url, bg, emoji){
  if(url) return '<img src="'+url+'" alt="" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.style.background=\''+bg+'\';this.parentNode.innerHTML=\'<div style=&quot;display:grid;place-items:center;height:100%;font-size:1.4em&quot;>'+emoji+'</div>\'">';
  return emoji;
}
function dayName(d){ return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][d]; }
function monthName(m){ return ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][m]; }
function monthShort(m){ return ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][m]; }

var H = new Date().getHours();
var TODAY = new Date();

/* ============================================================
   DATA
   ============================================================ */
var STYLES = [
  {id:'wax',emoji:'👗',name:'Wax moderne',desc:'Coloré & tendance'},
  {id:'bazin',emoji:'👘',name:'Bazin chic',desc:'Élégant & cérémonie'},
  {id:'classic',emoji:'👔',name:'Classique',desc:'Bureau & formel'},
  {id:'sport',emoji:'🎽',name:'Sport',desc:'Actif & confortable'},
  {id:'trad',emoji:'🥻',name:'Traditionnel',desc:'Boubous & cérémonie'},
  {id:'perfume',emoji:'🌸',name:'Parfums & Beauté',desc:'Cosmétiques & senteurs'}
];

var COLORS = [
  {id:'blue',hex:'#3b82f6',name:'Bleu'},
  {id:'indigo',hex:'#3b2f8f',name:'Indigo'},
  {id:'green',hex:'#10b981',name:'Vert'},
  {id:'red',hex:'#ef4444',name:'Rouge'},
  {id:'gold',hex:'#e0a526',name:'Doré'},
  {id:'pink',hex:'#ec4899',name:'Rose'},
  {id:'black',hex:'#1a1a1a',name:'Noir'},
  {id:'white',hex:'#f5f5f5',name:'Blanc'}
];

var PRODUCTS = [
  /* HOMME - 30 produits */
  {id:1,n:'Chemise Oxford blanche',e:'👔',h:'#cfc8b8',price:15000,cat:'classic',gender:'H',style:'classic',colors:['white','blue'],img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',storeId:1,rating:4.6},
  {id:2,n:'Polo bleu marine',e:'👕',h:'#1e3a8a',price:12500,cat:'classic',gender:'H',style:'classic',colors:['blue'],img:'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&h=500&fit=crop',storeId:1,rating:4.5},
  {id:3,n:'T-shirt noir coton',e:'👕',h:'#222',price:8500,cat:'casual',gender:'H',style:'modern',colors:['black'],img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',storeId:1,rating:4.7},
  {id:4,n:'Grand Boubou bazin',e:'🥻',h:'#3b2f8f',price:45000,cat:'trad',gender:'H',style:'trad',colors:['indigo','gold'],img:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',storeId:3,rating:4.9},
  {id:5,n:'Chemise Wax homme',e:'👘',h:'#d1495b',price:18500,cat:'wax',gender:'H',style:'wax',colors:['red','gold'],img:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop',storeId:3,rating:4.7},
  {id:6,n:'Débardeur sport',e:'🎽',h:'#e4572e',price:7500,cat:'sport',gender:'H',style:'sport',colors:['red','black'],img:'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&h=500&fit=crop',storeId:4,rating:4.4},
  {id:7,n:'Pantalon chino beige',e:'👖',h:'#b99b6b',price:19500,cat:'classic',gender:'H',style:'classic',colors:['white','gold'],img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop',storeId:1,rating:4.5},
  {id:8,n:'Jean slim foncé',e:'👖',h:'#2b3a55',price:22000,cat:'casual',gender:'H',style:'modern',colors:['blue','black'],img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',storeId:1,rating:4.6},
  {id:9,n:'Short sport training',e:'🩳',h:'#2a9d8f',price:9500,cat:'sport',gender:'H',style:'sport',colors:['green','black'],img:'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',storeId:4,rating:4.3},
  {id:10,n:'Veste cuir noir',e:'🧥',h:'#1a1a1a',price:65000,cat:'casual',gender:'H',style:'modern',colors:['black'],img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',storeId:1,rating:4.8},
  {id:11,n:'Mocassins cuir marron',e:'👞',h:'#6b4423',price:22000,cat:'classic',gender:'H',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&h=500&fit=crop',storeId:2,rating:4.8},
  {id:12,n:'Baskets blanches Nike',e:'👟',h:'#f5f5f5',price:35000,cat:'sport',gender:'H',style:'sport',colors:['white'],img:'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',storeId:2,rating:4.9},
  {id:13,n:'Baskets running noires',e:'👟',h:'#1a1a1a',price:42000,cat:'sport',gender:'H',style:'sport',colors:['black'],img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop',storeId:4,rating:4.7},
  {id:14,n:'Sandales Birkenstock',e:'🩴',h:'#a47148',price:28000,cat:'casual',gender:'H',style:'modern',colors:['gold'],img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop',storeId:2,rating:4.5},
  {id:15,n:'Babouches dorées',e:'🥿',h:'#c8a15a',price:12000,cat:'trad',gender:'H',style:'trad',colors:['gold'],img:'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&h=500&fit=crop',storeId:3,rating:4.6},
  {id:16,n:'Sneakers Adidas',e:'👟',h:'#2a9d8f',price:38000,cat:'sport',gender:'H',style:'sport',colors:['green'],img:'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&h=500&fit=crop',storeId:4,rating:4.7},
  {id:17,n:'Bottines cuir noir',e:'🥾',h:'#1a1a1a',price:55000,cat:'classic',gender:'H',style:'classic',colors:['black'],img:'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=500&fit=crop',storeId:1,rating:4.8},
  {id:18,n:'Claquettes plage',e:'🩴',h:'#f59e0b',price:6500,cat:'casual',gender:'H',style:'modern',colors:['gold'],img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop',storeId:2,rating:4.2},
  {id:19,n:'Montre argentée',e:'⌚',h:'#7a7f87',price:38000,cat:'accessory',gender:'H',style:'classic',colors:['white'],img:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop',storeId:1,rating:4.8},
  {id:20,n:'Ceinture cuir noir',e:'🪢',h:'#1a1a1a',price:12000,cat:'accessory',gender:'H',style:'classic',colors:['black'],img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',storeId:1,rating:4.5},
  {id:21,n:'Lunettes aviateur',e:'🕶️',h:'#1a1a1a',price:18000,cat:'accessory',gender:'H',style:'modern',colors:['black'],img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',storeId:1,rating:4.6},
  {id:22,n:'Casquette NY',e:'🧢',h:'#1e3a8a',price:8500,cat:'accessory',gender:'H',style:'sport',colors:['blue'],img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop',storeId:2,rating:4.4},
  {id:23,n:'Sac à dos cuir',e:'🎒',h:'#6b4423',price:45000,cat:'accessory',gender:'H',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',storeId:1,rating:4.7},
  {id:24,n:'Portefeuille cuir',e:'👛',h:'#1a1a1a',price:15000,cat:'accessory',gender:'H',style:'classic',colors:['black'],img:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',storeId:1,rating:4.6},
  {id:25,n:'Parfum Sauvage Dior',e:'🌸',h:'#1e3a8a',price:85000,cat:'perfume',gender:'H',style:'perfume',colors:['blue','black'],img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',storeId:5,rating:4.9,isPerfume:true},
  {id:26,n:'Parfum Bleu Chanel',e:'💙',h:'#1e40af',price:95000,cat:'perfume',gender:'H',style:'perfume',colors:['blue'],img:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop',storeId:5,rating:4.9,isPerfume:true},
  {id:27,n:'Eau de toilette Hugo Boss',e:'💚',h:'#059669',price:55000,cat:'perfume',gender:'H',style:'perfume',colors:['green'],img:'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=500&fit=crop',storeId:5,rating:4.7,isPerfume:true},
  {id:28,n:'Après-rasage Nivea',e:'🧴',h:'#1e3a8a',price:8500,cat:'cosmetic',gender:'H',style:'perfume',colors:['blue'],img:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',storeId:5,rating:4.5,isPerfume:true},
  {id:29,n:'Baume à barbe',e:'🧔',h:'#6b4423',price:12500,cat:'cosmetic',gender:'H',style:'perfume',colors:['gold'],img:'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&h=500&fit=crop',storeId:5,rating:4.6,isPerfume:true},
  {id:30,n:'Gel douche Musc',e:'🛁',h:'#7c3aed',price:5500,cat:'cosmetic',gender:'H',style:'perfume',colors:['indigo'],img:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop',storeId:5,rating:4.4,isPerfume:true},
  /* FEMME - 30 produits */
  {id:31,n:'Robe wax colorée',e:'👗',h:'#d1495b',price:18500,cat:'wax',gender:'F',style:'wax',colors:['red','pink'],img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',storeId:3,rating:4.9},
  {id:32,n:'Ensemble bazin brodé',e:'👘',h:'#3b2f8f',price:55000,cat:'bazin',gender:'F',style:'bazin',colors:['indigo','gold'],img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=500&fit=crop',storeId:3,rating:4.8},
  {id:33,n:'Blouse dentelle blanche',e:'👚',h:'#f5e6d3',price:14500,cat:'classic',gender:'F',style:'classic',colors:['white'],img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:34,n:'Robe de soirée noire',e:'🖤',h:'#1a1a1a',price:45000,cat:'classic',gender:'F',style:'classic',colors:['black'],img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=500&fit=crop',storeId:6,rating:4.8},
  {id:35,n:'Taille basse wax',e:'👗',h:'#0b7a43',price:22000,cat:'wax',gender:'F',style:'wax',colors:['green','gold'],img:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop',storeId:3,rating:4.7},
  {id:36,n:'Jupe crayon noire',e:'🖤',h:'#1a1a1a',price:16500,cat:'classic',gender:'F',style:'classic',colors:['black'],img:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop',storeId:6,rating:4.6},
  {id:37,n:'Robe longue fleurie',e:'🌸',h:'#ec4899',price:28000,cat:'casual',gender:'F',style:'modern',colors:['pink','red'],img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:38,n:'Blazer beige oversize',e:'🧥',h:'#b99b6b',price:38000,cat:'classic',gender:'F',style:'classic',colors:['gold','white'],img:'https://images.unsplash.com/photo-1548624313-0396c75f9a4e?w=500&h=500&fit=crop',storeId:6,rating:4.8},
  {id:39,n:'Jean slim taille haute',e:'👖',h:'#2b3a55',price:24000,cat:'casual',gender:'F',style:'modern',colors:['blue'],img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',storeId:6,rating:4.6},
  {id:40,n:'Robe cocktail or',e:'✨',h:'#e0a526',price:65000,cat:'classic',gender:'F',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=500&fit=crop',storeId:6,rating:4.9},
  {id:41,n:'Kimono wax moderne',e:'👘',h:'#d1495b',price:32000,cat:'wax',gender:'F',style:'wax',colors:['red','pink','gold'],img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',storeId:3,rating:4.8},
  {id:42,n:'Combinaison élégante',e:'🖤',h:'#1a1a1a',price:42000,cat:'classic',gender:'F',style:'modern',colors:['black'],img:'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:43,n:'Escarpins nude',e:'👠',h:'#c9a882',price:32000,cat:'classic',gender:'F',style:'classic',colors:['white','gold'],img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',storeId:6,rating:4.6},
  {id:44,n:'Sandales dorées',e:'👡',h:'#e0a526',price:18500,cat:'casual',gender:'F',style:'modern',colors:['gold'],img:'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:45,n:'Mules bazin',e:'🥿',h:'#c8a15a',price:14000,cat:'bazin',gender:'F',style:'bazin',colors:['gold'],img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',storeId:3,rating:4.6},
  {id:46,n:'Baskets blanches femme',e:'👟',h:'#f5f5f5',price:34000,cat:'casual',gender:'F',style:'modern',colors:['white'],img:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',storeId:2,rating:4.8},
  {id:47,n:'Bottines cuir marron',e:'🥾',h:'#6b4423',price:48000,cat:'classic',gender:'F',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:48,n:'Ballerines rouges',e:'👠',h:'#ef4444',price:38000,cat:'classic',gender:'F',style:'classic',colors:['red'],img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',storeId:6,rating:4.8},
  {id:49,n:'Sandales plates plage',e:'🩴',h:'#e0a526',price:8500,cat:'casual',gender:'F',style:'modern',colors:['gold'],img:'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop',storeId:6,rating:4.4},
  {id:50,n:'Sac à main doré',e:'👜',h:'#e0a526',price:28000,cat:'accessory',gender:'F',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop',storeId:6,rating:4.7},
  {id:51,n:'Parure bijoux or',e:'💎',h:'#e0a526',price:55000,cat:'accessory',gender:'F',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',storeId:3,rating:4.9},
  {id:52,n:'Foulard soie imprimé',e:'🧣',h:'#8b5a2b',price:8500,cat:'accessory',gender:'F',style:'bazin',colors:['gold','indigo'],img:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop',storeId:3,rating:4.6},
  {id:53,n:'Boucles oreilles dorées',e:'💍',h:'#e0a526',price:12000,cat:'accessory',gender:'F',style:'classic',colors:['gold'],img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',storeId:3,rating:4.7},
  {id:54,n:'Lunettes cat-eye',e:'🕶️',h:'#1a1a1a',price:16500,cat:'accessory',gender:'F',style:'modern',colors:['black'],img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop',storeId:6,rating:4.5},
  {id:55,n:'Montre or rose',e:'⌚',h:'#e0a526',price:32000,cat:'accessory',gender:'F',style:'classic',colors:['gold','pink'],img:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop',storeId:6,rating:4.8},
  {id:56,n:'Parfum Miss Dior',e:'🌹',h:'#ec4899',price:92000,cat:'perfume',gender:'F',style:'perfume',colors:['pink'],img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',storeId:5,rating:4.9,isPerfume:true},
  {id:57,n:'Parfum Chanel N°5',e:'💐',h:'#f5e6d3',price:125000,cat:'perfume',gender:'F',style:'perfume',colors:['white','gold'],img:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=500&fit=crop',storeId:5,rating:5.0,isPerfume:true},
  {id:58,n:'Parfum J\'adore Dior',e:'🌸',h:'#ec4899',price:110000,cat:'perfume',gender:'F',style:'perfume',colors:['pink','gold'],img:'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=500&fit=crop',storeId:5,rating:4.9,isPerfume:true},
  {id:59,n:'Rouge à lèvres mat',e:'💄',h:'#b5533c',price:2500,cat:'cosmetic',gender:'F',style:'perfume',colors:['red'],img:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop',storeId:5,rating:4.7,isPerfume:true},
  {id:60,n:'Palette maquillage nude',e:'🎨',h:'#8b5a2b',price:12000,cat:'cosmetic',gender:'F',style:'perfume',colors:['gold'],img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',storeId:5,rating:4.6,isPerfume:true}
];

var STORES = [
  {id:1,n:'Boutique Teranga',e:'🏬',verified:true},
  {id:2,n:'Sandaga Sneakers',e:'👟'},
  {id:3,n:'Atelier Wax & Co',e:'🧵',verified:true},
  {id:4,n:'Almadies Sport',e:'⚽'},
  {id:5,n:'Beauté Ndaw',e:'💄',verified:true},
  {id:6,n:'Maternita Dakar',e:'👗',verified:true}
];

var GIFT_TYPES = [
  {id:'love', emoji:'❤️', name:'Amour', desc:'Pour ton/ta partenaire', points:50},
  {id:'friend', emoji:'👥', name:'Ami(e)', desc:'Pour un(e) ami(e) proche', points:25},
  {id:'marriage', emoji:'💍', name:'Mariage', desc:'Pour un mariage', points:100},
  {id:'friendly', emoji:'🤝', name:'Amical', desc:'Pour un contact sympa', points:15},
  {id:'family', emoji:'👨‍👩‍👧', name:'Famille', desc:'Pour la famille', points:30},
  {id:'colleague', emoji:'💼', name:'Collègue', desc:'Pour un collègue', points:20}
];

var VIDEOS = [
  {id:1, user:'Keyfa World', poster:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=900&fit=crop', desc:'Collection Grands Boubous', tags:['trad','bazin'], likes:15200, productId:4},
  {id:2, user:'Mossane Beauté', poster:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=900&fit=crop', desc:'Tuto maquillage terracotta', tags:['beauty','cosmetic'], likes:12400, productId:59},
  {id:3, user:'Maison Pen', poster:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=900&fit=crop', desc:'Atelier couture sur-mesure', tags:['trad','bazin'], likes:8100, productId:32},
  {id:4, user:'Maternita', poster:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=900&fit=crop', desc:'Collection femme moderne', tags:['wax','classic'], likes:9700, productId:31},
  {id:5, user:'Parfums Dakar', poster:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=900&fit=crop', desc:'Les senteurs de luxe', tags:['perfume'], likes:6200, productId:56}
];

var CALENDAR = [
  {name:'Nouvel An', type:'national', date:'2026-01-01', icon:'🎉', desc:'Jour de l\'an'},
  {name:'Ramadan', type:'islam', date:'2026-02-18', icon:'🌙', desc:'Début du mois sacré'},
  {name:'Korité', type:'islam', date:'2026-03-20', icon:'🕌', desc:'Fin du Ramadan'},
  {name:'Fête Indépendance', type:'national', date:'2026-04-04', icon:'🇸🇳', desc:'Indépendance du Sénégal'},
  {name:'Fête du Travail', type:'national', date:'2026-05-01', icon:'💼', desc:'Journée des travailleurs'},
  {name:'Tabaski', type:'islam', date:'2026-05-28', icon:'🐏', desc:'Fête du sacrifice'},
  {name:'Grand Magal Touba', type:'islam', date:'2026-08-03', icon:'🕌', desc:'Pèlerinage de Touba'},
  {name:'Assomption', type:'christian', date:'2026-08-15', icon:'🙏', desc:'Élévation de la Vierge'},
  {name:'Maouloud', type:'islam', date:'2026-08-25', icon:'📿', desc:'Naissance du Prophète ﷺ'},
  {name:'Toussaint', type:'christian', date:'2026-11-01', icon:'🕯️', desc:'Fête de tous les saints'},
  {name:'Noël', type:'christian', date:'2026-12-25', icon:'🎄', desc:'Naissance du Christ'}
];

var COUNTRIES = [
  {code:'SN',flag:'🇸🇳',name:'Sénégal'},
  {code:'CI',flag:'🇨🇮',name:'Côte d\'Ivoire'},
  {code:'ML',flag:'🇲🇱',name:'Mali'},
  {code:'FR',flag:'🇫🇷',name:'France'}
];

var LANGUAGES = [
  {code:'fr',flag:'🇫🇷',name:'Français'},
  {code:'en',flag:'🇬🇧',name:'English'},
  {code:'ar',flag:'🇸🇦',name:'العربية'},
  {code:'wo',flag:'🇸🇳',name:'Wolof'}
];

/* ============================================================
   COLD START ENGINE
   ============================================================ */
var ColdStart = {
  track: function(type, data){
    var c = S.cold;
    c.interactions++;
    switch(type){
      case 'like': c.signals.likes++; break;
      case 'save': c.signals.saves++; break;
      case 'purchase': c.signals.purchases++; break;
      case 'tap': c.signals.taps++; break;
      case 'videoLike': c.signals.videoLikes++; break;
      case 'productView':
        if(data){
          c.inferred.categories[data.cat] = (c.inferred.categories[data.cat] || 0) + 1;
          (data.colors || []).forEach(function(col){ c.inferred.colors[col] = (c.inferred.colors[col] || 0) + 1; });
          c.inferred.priceHits.push(data.price);
          var sum = 0; c.inferred.priceHits.forEach(function(p){ sum += p; });
          c.inferred.avgPrice = Math.round(sum / c.inferred.priceHits.length);
        }
        break;
    }
    var i = c.interactions;
    var old = c.phase;
    if(i >= 100) c.phase = 4;
    else if(i >= 50) c.phase = 3;
    else if(i >= 20) c.phase = 2;
    else if(i >= 5) c.phase = 1;
    if(c.phase !== old && old > 0){
      var msgs = {1:'📊 Apprentissage actif',2:'👥 Profil affiné',3:'🧠 IA hybride',4:'✨ IA personnalisée'};
      addNotif('✨', 'Nouvelle phase IA', msgs[c.phase]);
    }
  },
  recommend: function(limit, genderFilter){
    limit = limit || 10;
    var c = S.cold;
    var gender = genderFilter || S.prof.sex || 'H';
    var products = PRODUCTS.filter(function(p){ return p.gender === gender; });
    products.forEach(function(p){
      p._score = 0; p._reasons = [];
      if(S.prof.style && p.style === S.prof.style){ p._score += 30; p._reasons.push('Ton style préféré'); }
      if(S.prof.colors && S.prof.colors.length){
        var cm = p.colors.filter(function(col){ return S.prof.colors.indexOf(col) >= 0; }).length;
        if(cm > 0){ p._score += cm * 10; p._reasons.push('Ta couleur préférée'); }
      }
      if(S.prof.budget){
        var ratio = p.price / S.prof.budget;
        if(ratio >= 0.5 && ratio <= 1.5){ p._score += 20; p._reasons.push('Dans ton budget'); }
        else if(ratio > 2.5) p._score -= 25;
      }
      if(c.inferred.categories[p.cat]) p._score += Math.min(30, c.inferred.categories[p.cat] * 5);
      if(c.inferred.avgPrice > 0 && Math.abs(p.price - c.inferred.avgPrice) < 5000) p._score += 15;
      p._score += p.rating * 3;
    });
    products.sort(function(a,b){ return b._score - a._score; });
    if(c.phase === 0) products = shuffleArray(products);
    return products.slice(0, limit);
  },
  phaseLabel: function(){ return ['🎯 Apprentissage','📊 Signaux captés','👥 Profil démo','🧠 Hybride','✨ IA perso'][S.cold.phase]; },
  phaseProgress: function(){
    var i = S.cold.interactions, p = S.cold.phase;
    var start = p === 0 ? 0 : (p === 1 ? 5 : (p === 2 ? 20 : 50));
    var end = p === 0 ? 5 : (p === 1 ? 20 : (p === 2 ? 50 : 100));
    return Math.min(100, Math.round(((i - start) / (end - start)) * 100));
  }
};

function shuffleArray(arr){ var a = arr.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random()*(i+1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

/* ============================================================
   GIFT SYSTEM
   ============================================================ */
var GiftSystem = {
  offer: function(productId, giftType){
    var product = PRODUCTS.filter(function(p){ return p.id === productId; })[0];
    var type = GIFT_TYPES.filter(function(t){ return t.id === giftType; })[0];
    if(!product || !type) return 0;
    var bonus = Math.round(type.points * (1 + product.price / 100000));
    S.gift.points += bonus;
    S.gift.totalSent++;
    S.gift.history.unshift({id:Date.now(), productId:productId, productName:product.n, productEmoji:product.e, typeEmoji:type.emoji, typeName:type.name, points:bonus, time:now()});
    if(S.gift.totalSent === 1 && S.gift.badges.indexOf('first_gift') < 0){ S.gift.badges.push('first_gift'); S.gift.points += 10; addNotif('🎁','Premier cadeau !','+10 points bonus'); }
    if(S.gift.totalSent === 10 && S.gift.badges.indexOf('generous') < 0){ S.gift.badges.push('generous'); addNotif('💝','Généreux !','Badge débloqué'); }
    if(S.gift.totalSent === 50 && S.gift.badges.indexOf('santa') < 0){ S.gift.badges.push('santa'); addNotif('🎅','Père Noël','Badge débloqué !'); }
    addNotif(type.emoji, 'Cadeau envoyé !', product.n + ' → ' + type.name);
    confetti();
    return bonus;
  }
};

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
function addNotif(icon, title, text){
  S.notifications.unshift({id: Date.now()+Math.random(), icon:icon, title:title, text:text, time:now(), read:false});
  updateNotifCount();
}
function updateNotifCount(){
  var el = $('#giftBadge');
  if(el){
    var unread = S.notifications.filter(function(n){ return !n.read; }).length;
    if(unread > 0){ el.textContent = unread; el.style.display = 'block'; }
    else el.style.display = 'none';
  }
}

/* ============================================================
   ONBOARDING
   ============================================================ */
function renderOnb(){
  var ob = $('#onb');
  if(!ob) return;
  if(S.ob >= 8){ ob.style.display = 'none'; return; }
  ob.style.display = 'flex';
  var step = S.ob;
  var content = '';

  if(step === 0){
    content = '<div class="ob-wrap"><div class="ob-emoji">👋</div><div class="ob-title">Bienvenue sur WEARLY</div><div class="ob-sub">Ton styliste IA avec cadeaux & points</div><input class="ob-input" id="obName" placeholder="Ton nom..." value="'+S.obData.name+'"><button class="ob-btn" id="obNext" disabled>Commencer →</button></div>';
  } else if(step === 1){
    content = '<div class="ob-wrap"><div class="ob-emoji">'+(S.obData.sex === 'F' ? '👩' : '👨')+'</div><div class="ob-title">Ton profil</div><div class="ob-choice"><div class="'+(S.obData.sex === 'H' ? 'on' : '')+'" data-sex="H"><span class="ico">👨</span><b>Homme</b></div><div class="'+(S.obData.sex === 'F' ? 'on' : '')+'" data-sex="F"><span class="ico">👩</span><b>Femme</b></div></div><button class="ob-btn" id="obNext">Continuer →</button></div>';
  } else if(step === 2){
    content = '<div class="ob-wrap"><div class="ob-emoji">🎂</div><div class="ob-title">Ton âge</div><div class="ob-age-num" id="obAgeVal">'+S.obData.age+'</div><div class="ob-age-lbl">ans</div><input type="range" class="ob-range" id="obRange" min="16" max="70" value="'+S.obData.age+'"><button class="ob-btn" id="obNext">Continuer →</button></div>';
  } else if(step === 3){
    content = '<div class="ob-wrap"><div class="ob-emoji">🌍</div><div class="ob-title">Ton pays</div><div class="ob-grid">' + COUNTRIES.map(function(c){ return '<div class="ob-country '+(S.obData.country === c.code ? 'on' : '')+'" data-country="'+c.code+'"><span>'+c.flag+'</span><b>'+c.name+'</b></div>'; }).join('') + '</div><button class="ob-btn" id="obNext">Continuer →</button></div>';
  } else if(step === 4){
    content = '<div class="ob-wrap"><div class="ob-emoji">📱</div><div class="ob-title">Ton numéro</div><div class="ob-sub">🔒 Confidentiel</div><input class="ob-input" id="obPhone" type="tel" placeholder="77 123 45 67" value="'+S.obData.phone+'"><button class="ob-btn" id="obNext">Continuer →</button></div>';
  } else if(step === 5){
    content = '<div class="ob-wrap"><div class="ob-emoji">🎨</div><div class="ob-title">Ton style</div><div class="ob-grid">' + STYLES.map(function(s){ return '<div class="ob-country '+(S.obData.stylePref === s.id ? 'on' : '')+'" data-style="'+s.id+'"><span>'+s.emoji+'</span><b>'+s.name+'</b></div>'; }).join('') + '</div><button class="ob-btn" id="obNext">Continuer →</button><button class="ob-btn skip" onclick="window.obSkip()">Passer</button></div>';
  } else if(step === 6){
    content = '<div class="ob-wrap"><div class="ob-emoji">💰</div><div class="ob-title">Ton budget</div><div style="text-align:center;font-size:28px;font-weight:900;color:var(--ac);margin-bottom:12px" id="budgetVal">'+S.obData.budget.toLocaleString('fr-FR')+' FCFA</div><input type="range" class="ob-range" id="obBudget" min="5000" max="200000" step="5000" value="'+S.obData.budget+'"><button class="ob-btn" id="obNext">Continuer →</button><button class="ob-btn skip" onclick="window.obSkip()">Passer</button></div>';
  } else if(step === 7){
    content = '<div class="ob-wrap"><div class="ob-emoji">🎨</div><div class="ob-title">Tes couleurs</div><div style="text-align:center;color:var(--mu);font-size:12px;margin-bottom:14px">3 maximum</div><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:16px">' + COLORS.map(function(c){ var on = S.obData.colors.indexOf(c.id) >= 0; return '<div data-color="'+c.id+'" style="width:52px;height:52px;border-radius:50%;background:'+c.hex+';cursor:pointer;border:3px solid '+(on ? '#fff' : 'transparent')+';display:grid;place-items:center;color:#fff;font-size:20px;font-weight:900">'+(on ? '✓' : '')+'</div>'; }).join('') + '</div><button class="ob-btn" id="obFinish">✨ Découvrir</button><button class="ob-btn skip" onclick="window.finishOnb()">Passer</button></div>';
  }
  ob.innerHTML = content;

  if(step === 0){
    var inp = $('#obName'), btn = $('#obNext');
    btn.addEventListener('click', obNext);
    inp.addEventListener('input', function(){ S.obData.name = inp.value; btn.disabled = !inp.value.trim(); });
    inp.addEventListener('keydown', function(e){ if(e.key === 'Enter' && inp.value.trim()) obNext(); });
  } else if(step === 1){
    $$('.ob-choice > div').forEach(function(el){ el.addEventListener('click', function(){ S.obData.sex = el.dataset.sex; renderOnb(); }); });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 2){
    var range = $('#obRange'), val = $('#obAgeVal');
    range.addEventListener('input', function(){ S.obData.age = +range.value; val.textContent = range.value; });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 3){
    $$('.ob-country').forEach(function(el){ el.addEventListener('click', function(){ S.obData.country = el.dataset.country; renderOnb(); }); });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 4){
    var p = $('#obPhone');
    p.addEventListener('input', function(){ S.obData.phone = p.value; });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 5){
    $$('.ob-country').forEach(function(el){ el.addEventListener('click', function(){ S.obData.stylePref = el.dataset.style; renderOnb(); }); });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 6){
    var b = $('#obBudget'), bv = $('#budgetVal');
    b.addEventListener('input', function(){ S.obData.budget = +b.value; bv.textContent = (+b.value).toLocaleString('fr-FR') + ' FCFA'; });
    $('#obNext').addEventListener('click', obNext);
  } else if(step === 7){
    $$('[data-color]').forEach(function(el){ el.addEventListener('click', function(){ var id = el.dataset.color; var idx = S.obData.colors.indexOf(id); if(idx >= 0){ S.obData.colors.splice(idx, 1); } else if(S.obData.colors.length < 3){ S.obData.colors.push(id); } else { toast('Maximum 3'); return; } renderOnb(); }); });
    $('#obFinish').addEventListener('click', finishOnb);
  }
}

function obNext(){ S.ob++; if(S.ob >= 8) finishOnb(); else renderOnb(); }
function obSkip(){ S.ob++; if(S.ob >= 8) finishOnb(); else renderOnb(); }

function finishOnb(){
  S.prof.name = (S.obData.name || '').trim() || 'Ami(e)';
  S.prof.sex = S.obData.sex || 'H';
  S.prof.age = S.obData.age;
  S.prof.country = S.obData.country || 'SN';
  S.prof.style = S.obData.stylePref || '';
  S.prof.budget = S.obData.budget || 20000;
  S.prof.colors = S.obData.colors.slice();
  S.shopGender = S.prof.sex;
  document.documentElement.setAttribute('data-gender', S.prof.sex);

  S.friends = [
    {id:1, name:'Fatou D.', pseudo:'@fatou', photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', online:true},
    {id:2, name:'Aïssatou N.', pseudo:'@aissatou', photo:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', online:false},
    {id:3, name:'Mariama S.', pseudo:'@mariama', photo:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', online:true}
  ];
  S.friendRequests = [{id:100, name:'Coumba N.', pseudo:'@coumba', photo:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}];
  S.stats = {profileViews: Math.floor(Math.random()*500)+120, videoViews: Math.floor(Math.random()*3000)+500, sharedPosts: Math.floor(Math.random()*80)+12, giftsReceived: Math.floor(Math.random()*40)+5};
  addNotif('🔥', 'Bienvenue ' + S.prof.name, 'Ton styliste IA est prêt !');

  var ob = $('#onb');
  ob.style.opacity = '0'; ob.style.transition = 'opacity .3s';
  setTimeout(function(){ ob.style.display = 'none'; ob.style.opacity = '1'; S.ob = 8; go(); }, 320);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function go(){
  var view = V[S.tab] ? V[S.tab]() : V.home();
  $('#main').innerHTML = view;
  $('#main').className = S.tab === 'videos' ? 'no-pad' : '';

  var navHtml =
    '<div class="nav-btn '+(S.tab === 'home' ? 'on' : '')+'" onclick="window.goTab(\'home\')"><span>🏠</span>Accueil</div>' +
    '<div class="nav-btn '+(S.tab === 'videos' ? 'on' : '')+'" onclick="window.goTab(\'videos\')"><span>🎬</span>Vidéos</div>' +
    '<div class="nav-btn '+(S.tab === 'shop' ? 'on' : '')+'" onclick="window.goTab(\'shop\')"><span>🛍️</span>Shop</div>' +
    '<div class="nav-btn '+(S.tab === 'gifts' ? 'on' : '')+'" onclick="window.goTab(\'gifts\')"><span>🎁</span>Cadeaux</div>' +
    '<div class="nav-btn '+(S.tab === 'profile' ? 'on' : '')+'" onclick="window.goTab(\'profile\')"><span>👤</span>Moi</div>';
  $('#nav').innerHTML = navHtml;

    renderDrawer();
  updateNotifCount();

  /* ---------- Sauvegarde automatique de l'état ---------- */
  if (window.AppState) window.AppState.save(S);
}

function goTab(t){ S.tab = t; var m = $('#main'); if(m) m.scrollTop = 0; go(); }
function openDrawer(){ $('#drawer').classList.add('open'); $('#drawer-overlay').classList.add('open'); }
function closeDrawer(){ $('#drawer').classList.remove('open'); $('#drawer-overlay').classList.remove('open'); }

function renderDrawer(){
  var reqBadge = S.friendRequests.length ? '<span class="drawer-badge">'+S.friendRequests.length+'</span>' : '';
  var html = '<div class="drawer-head"><h2>✨ WEARLY</h2><div class="mu">Le styliste de ta culture</div></div>' +
    '<div class="drawer-user" onclick="window.closeDrawer();window.goTab(\'profile\')">' +
      '<div class="avatar-lg">'+(S.prof.name[0] || 'A')+'</div>' +
      '<div><b style="font-size:14px">'+(S.prof.name || 'Ami(e)')+'</b>' +
      '<div class="mu">'+S.gift.points+' points · '+S.cold.interactions+' interactions</div></div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Général</h4>' +
      '<div class="drawer-item" data-nav="home"><span class="ico">🏠</span> Accueil</div>' +
      '<div class="drawer-item" data-nav="videos"><span class="ico">🎬</span> Vidéos</div>' +
      '<div class="drawer-item" data-nav="shop"><span class="ico">🛍️</span> Boutique (60)</div>' +
      '<div class="drawer-item" data-nav="gifts"><span class="ico">🎁</span> Cadeaux <span class="drawer-badge">'+S.gift.points+'</span></div>' +
      '<div class="drawer-item" data-nav="library"><span class="ico">📚</span> Ma bibliothèque</div>' +
      '<div class="drawer-item" data-nav="friends"><span class="ico">👥</span> Amis'+reqBadge+'</div>' +
      '<div class="drawer-item" data-nav="msg"><span class="ico">💬</span> Messages</div>' +
      '<div class="drawer-item" data-nav="profile"><span class="ico">👤</span> Mon compte</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Culture & Foi</h4>' +
      '<div class="drawer-item" data-nav="calendar"><span class="ico">📅</span> Calendrier</div>' +
      '<div class="drawer-item" data-nav="prayer"><span class="ico">🕌</span> Mode Prière</div>' +
      '<div class="drawer-item" data-nav="social"><span class="ico">🎉</span> Mes événements</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Communauté</h4>' +
      '<div class="drawer-item" data-nav="challenge"><span class="ico">🎯</span> Défi de la semaine</div>' +
      '<div class="drawer-item" data-nav="mystery"><span class="ico">🎭</span> Styliste mystère</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Shopping</h4>' +
      '<div class="drawer-item" data-nav="coffret"><span class="ico">📦</span> Coffret surprise</div>' +
      '<div class="drawer-item" data-nav="vestiaire"><span class="ico">👗</span> Vestiaire des amis</div>' +
      '<div class="drawer-item" data-nav="publier"><span class="ico">🎥</span> Publier une vidéo</div>' +
      '<div class="drawer-item" data-nav="mesvideos"><span class="ico">🎬</span> Mes vidéos</div>' +
      '<div class="drawer-item" data-nav="reglages"><span class="ico">📱</span> Téléphone & réseau</div>' +
'<div class="drawer-item" data-nav="rental"><span class="ico">♻️</span> Location</div>' +
      '<div class="drawer-item" data-nav="creators"><span class="ico">🧵</span> Créateurs</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Innovation</h4>' +
      '<div class="drawer-item" data-nav="studio"><span class="ico">🎵</span> Studio vidéo</div>' +
      '<div class="drawer-item" data-nav="ar"><span class="ico">🪞</span> Essayage AR</div>' +
      '<div class="drawer-item" data-nav="voice"><span class="ico">🎤</span> Styliste vocal</div>' +
      '<div class="drawer-item" data-nav="journal"><span class="ico">📸</span> Journal de style</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Intelligence</h4>' +
      '<div class="drawer-item" data-nav="insights"><span class="ico">🧠</span> Profil IA</div>' +
      '<div class="drawer-item" onclick="window.openSettings()"><span class="ico">⚙️</span> Paramètres</div>' +
    '</div>' +
    '<div class="drawer-section"><h4>Développement</h4>' +
      '<div class="drawer-item" onclick="window.simulateInteractions()"><span class="ico">⚡</span> Simuler +50 interactions</div>' +
      '<div class="drawer-item" onclick="window.resetOnb()"><span class="ico">🔄</span> Réinitialiser</div>' +
    '</div>';
  $('#drawer').innerHTML = html;

  $$('.drawer-item[data-nav]').forEach(function(item){
    item.addEventListener('click', function(){
      closeDrawer();
      S.tab = item.dataset.nav;
      setTimeout(go, 200);
    });
  });
}

/* ============================================================
   OVERLAY / TOAST
   ============================================================ */
function ov(html){
  var el = $('#ov');
  if(!html){ el.style.display = 'none'; el.innerHTML = ''; return; }
  el.innerHTML = '<div class="ov-back" onclick="window.ov()">‹ Retour</div>' + html;
  el.style.display = 'block';
  el.scrollTop = 0;
}
function toast(txt){
  var t = $('#toast');
  t.textContent = txt;
  t.classList.add('show');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(function(){ t.classList.remove('show'); }, 1800);
}
function confetti(){
  var colors = ['#3b82f6','#ec4899','#a855f7','#e0a526','#10b981','#ef4444'];
  for(var i=0;i<30;i++){
    var c = document.createElement('div');
    c.style.cssText = 'position:fixed;width:10px;height:10px;z-index:99;pointer-events:none;left:'+(Math.random()*100)+'%;top:-20px;background:'+colors[i%colors.length]+';border-radius:2px;animation:confFall 2s ease-out forwards';
    document.body.appendChild(c);
    setTimeout(function(el){ return function(){ el.remove(); }; }(c), 2500);
  }
}
var st = document.createElement('style');
st.textContent = '@keyframes confFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
document.head.appendChild(st);

/* ============================================================
   VIEWS
   ============================================================ */
var V = {};

function productCardHtml(p){
  return '<div class="product-card'+(p.isPerfume ? ' perfume' : '')+'" onclick="window.viewProduct('+p.id+')">' +
    '<div class="img" style="background:'+p.h+'">' + imgTag(p.img, p.h, p.e) +
      '<div class="gender">'+(p.gender === 'H' ? '👨' : '👩')+'</div>' +
      (p.price > 40000 ? '<div class="badge">PREMIUM</div>' : '') +
      '<div class="offer-btn" onclick="event.stopPropagation();window.openGift('+p.id+')">🎁</div>' +
    '</div>' +
    '<div class="info"><b>'+p.n+'</b><div class="price">'+cfa(p.price)+'</div><div class="rating">⭐ '+p.rating+'</div></div>' +
  '</div>';
}

/* HOME */
V.home = function(){
  var recos = ColdStart.recommend(6);
  var w = H < 12 ? 'Salaam aleykum' : (H < 18 ? 'Bonjour' : 'Bonsoir');
  var prog = ColdStart.phaseProgress();
  return '<div class="fade">' +
    '<h1>'+w+' '+S.prof.name+' 👋</h1>' +
    '<div class="mu">'+(S.prof.sex === 'F' ? '👩 Femme' : '👨 Homme')+' · '+S.prof.age+' ans · '+S.prof.country+'</div>' +

    '<div class="coldstart-box" style="margin-top:14px">' +
      '<div class="coldstart-phase">' +
        '<div class="coldstart-icon">'+['🎯','📊','👥','🧠','✨'][S.cold.phase]+'</div>' +
        '<div class="coldstart-body"><b>'+ColdStart.phaseLabel()+'</b>' +
        '<div class="mu">'+(S.cold.phase === 0 ? 'On découvre tes goûts' : S.cold.phase === 1 ? 'On apprend en observant' : S.cold.phase === 2 ? 'On utilise des profils similaires' : S.cold.phase === 3 ? 'On combine tous les signaux' : 'Ton IA est totalement active')+'</div></div>' +
      '</div>' +
      '<div class="coldstart-progress"><i style="width:'+prog+'%"></i></div>' +
      '<div class="coldstart-stats">' +
        '<div class="coldstart-stat"><div class="num">'+S.cold.interactions+'</div><div class="lbl">Interactions</div></div>' +
        '<div class="coldstart-stat"><div class="num">'+Object.keys(S.cold.inferred.categories).length+'</div><div class="lbl">Catégories</div></div>' +
        '<div class="coldstart-stat"><div class="num">'+Math.round(prog)+'%</div><div class="lbl">Phase</div></div>' +
      '</div>' +
    '</div>' +

    '<div class="points-banner" onclick="window.goTab(\'gifts\')">' +
      '<div class="ico">🎁</div>' +
      '<div style="flex:1"><div class="val">'+S.gift.points+' pts</div>' +
      '<div class="lbl">'+S.gift.totalSent+' cadeaux envoyés</div></div>' +
      '<div style="font-size:24px;opacity:.7">›</div>' +
    '</div>' +

    '<h2>✨ Recommandé pour toi</h2>' +
    '<div class="grid">' + recos.map(productCardHtml).join('') + '</div>' +

    '<button class="btn full" style="margin-top:14px" onclick="window.goTab(\'shop\')">🛍️ Voir les 60 produits</button>' +
    '<button class="btn o full" style="margin-top:8px" onclick="window.goTab(\'insights\')">🧠 Voir mon profil IA</button>' +
  '</div>';
};

/* VIDEOS */
V.videos = function(){
  var videos = VIDEOS.slice();
  if(S.cold.phase >= 2){
    var topCats = Object.keys(S.cold.inferred.categories).sort(function(a,b){ return S.cold.inferred.categories[b] - S.cold.inferred.categories[a]; }).slice(0, 3);
    if(topCats.length) videos.sort(function(a,b){
      var aS = a.tags.filter(function(t){ return topCats.indexOf(t) >= 0; }).length;
      var bS = b.tags.filter(function(t){ return topCats.indexOf(t) >= 0; }).length;
      return bS - aS;
    });
  }
  return '<div id="videoFeed">' + videos.map(function(v){
    return '<div class="tiktok-video" style="background-image:url(\''+v.poster+'\')" onclick="window.trackVideoView('+v.id+',\''+v.tags.join(',')+'\')">' +
      '<div class="tiktok-side">' +
        '<div onclick="event.stopPropagation();window.trackVideoLike('+v.id+',\''+v.tags.join(',')+'\')">' +
          '<div style="font-size:30px">'+(S.likedProducts.indexOf('v'+v.id) >= 0 ? '❤️' : '🤍')+'</div>' +
          '<div>'+(v.likes/1000).toFixed(1)+'k</div>' +
        '</div>' +
        '<div style="font-size:30px">💬</div>' +
        '<div style="font-size:30px">↗️</div>' +
      '</div>' +
      '<div class="tiktok-bottom">' +
        '<div class="user">@'+v.user.replace(/\s+/g,'')+'</div>' +
        '<div class="desc">'+v.desc+'</div>' +
        '<div class="music">🎵 Teranga Beat</div>' +
        (v.productId ? '<button class="product-btn" onclick="event.stopPropagation();window.viewProduct('+v.productId+')">🛍️ Voir le produit</button>' : '') +
      '</div>' +
    '</div>';
  }).join('') + '</div>';
};

/* SHOP */
V.shop = function(){
  var cats = [
    {id:'all', label:'Tout', emoji:'🌍'},
    {id:'wax', label:'Wax', emoji:'👗'},
    {id:'bazin', label:'Bazin', emoji:'👘'},
    {id:'trad', label:'Traditionnel', emoji:'🥻'},
    {id:'classic', label:'Classique', emoji:'👔'},
    {id:'sport', label:'Sport', emoji:'🎽'},
    {id:'casual', label:'Casual', emoji:'👕'},
    {id:'perfume', label:'Parfums', emoji:'🌸'},
    {id:'cosmetic', label:'Cosmétiques', emoji:'💄'},
    {id:'accessory', label:'Accessoires', emoji:'💎'}
  ];
  var filter = S.filterCat || 'all';
  var g = S.shopGender || S.prof.sex || 'H';
  var list = PRODUCTS.filter(function(p){ return (filter === 'all' || p.cat === filter) && p.gender === g; });
  var menCount = PRODUCTS.filter(function(p){ return p.gender === 'H'; }).length;
  var womenCount = PRODUCTS.filter(function(p){ return p.gender === 'F'; }).length;

  return '<div class="fade">' +
    '<h1>🛍️ Boutique</h1>' +
    '<div class="mu" style="margin-top:4px">60 produits · '+menCount+' H · '+womenCount+' F</div>' +
    '<div style="display:flex;gap:8px;margin-top:14px;margin-bottom:12px">' +
      '<button class="btn '+(g === 'H' ? '' : 'o')+'" style="flex:1" onclick="window.setShopGender(\'H\')">👨 Hommes ('+menCount+')</button>' +
      '<button class="btn '+(g === 'F' ? '' : 'o')+'" style="flex:1" onclick="window.setShopGender(\'F\')">👩 Femmes ('+womenCount+')</button>' +
    '</div>' +
    '<div class="scroll">' + cats.map(function(c){ return '<div class="chip '+(filter === c.id ? 'on' : '')+'" onclick="window.setShopCat(\''+c.id+'\')">'+c.emoji+' '+c.label+'</div>'; }).join('') + '</div>' +
    (list.length ? '<div class="grid" style="margin-top:14px">' + list.map(productCardHtml).join('') + '</div>' : '<div class="empty"><span class="empty-icon">🔍</span>Aucun produit</div>') +
  '</div>';
};

/* GIFTS */
V.gifts = function(){
  return '<div class="fade">' +
    '<h1>🎁 Cadeaux & Points</h1>' +
    '<div style="background:var(--grad-gold);color:#0a0e1a;border-radius:22px;padding:24px;text-align:center;margin:14px 0;box-shadow:0 8px 32px rgba(224,165,38,.4)">' +
      '<div style="font-size:14px;font-weight:800;opacity:.8;text-transform:uppercase;letter-spacing:1px">Tes points</div>' +
      '<div style="font-size:56px;font-weight:900;letter-spacing:-2px;line-height:1;margin:8px 0">'+S.gift.points+'</div>' +
      '<div style="font-size:13px;font-weight:800;opacity:.75">'+S.gift.totalSent+' cadeaux envoyés</div>' +
    '</div>' +
    '<div class="grid3">' +
      '<div class="card" style="text-align:center;padding:12px 6px"><div style="font-size:20px;font-weight:900;color:var(--ac)">'+S.gift.totalSent+'</div><div class="mu" style="font-size:10px">Envoyés</div></div>' +
      '<div class="card" style="text-align:center;padding:12px 6px"><div style="font-size:20px;font-weight:900;color:var(--gold)">'+S.gift.points+'</div><div class="mu" style="font-size:10px">Points</div></div>' +
      '<div class="card" style="text-align:center;padding:12px 6px"><div style="font-size:20px;font-weight:900;color:var(--green)">'+S.gift.badges.length+'</div><div class="mu" style="font-size:10px">Badges</div></div>' +
    '</div>' +
    '<h2>💡 Gagne des points</h2>' +
    '<div class="card">' + GIFT_TYPES.map(function(t){
      return '<div class="sl"><div style="font-size:28px">'+t.emoji+'</div><div style="flex:1"><b style="font-size:13px">'+t.name+'</b><div class="mu">'+t.desc+'</div></div><div style="background:var(--grad-gold);color:#0a0e1a;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:900">+'+t.points+'</div></div>';
    }).join('') + '</div>' +
    (S.gift.badges.length ? '<h2>🏆 Mes badges</h2><div class="card"><div style="display:flex;flex-wrap:wrap;gap:8px">' + S.gift.badges.map(function(b){
      var map = {first_gift:['🎁','Premier'],generous:['💝','Généreux'],santa:['🎅','Père Noël']};
      var bd = map[b] || ['⭐','Badge'];
      return '<div style="background:var(--bg2);border-radius:12px;padding:8px 12px;font-size:11.5px;font-weight:700">'+bd[0]+' '+bd[1]+'</div>';
    }).join('') + '</div></div>' : '') +
    '<h2>📜 Historique</h2>' +
    (S.gift.history.length ? S.gift.history.slice(0, 20).map(function(h){
      return '<div class="card row" style="padding:12px">' +
        '<div class="th" style="width:44px;height:44px;font-size:22px;background:var(--grad)">'+h.typeEmoji+'</div>' +
        '<div style="flex:1"><b style="font-size:13px">'+h.typeName+'</b><div class="mu">'+h.productEmoji+' '+h.productName+'</div></div>' +
        '<div style="text-align:right"><div style="color:var(--gold);font-size:14px;font-weight:900">+'+h.points+'</div><div class="mu" style="font-size:10px">'+h.time+'</div></div>' +
      '</div>';
    }).join('') : '<div class="empty"><span class="empty-icon">🎁</span>Aucun cadeau envoyé<br><div style="margin-top:8px;font-size:12px">Ouvre un produit et clique sur 🎁</div></div>') +
  '</div>';
};

/* INSIGHTS */
V.insights = function(){
  var c = S.cold;
  var cats = Object.keys(c.inferred.categories).sort(function(a,b){ return c.inferred.categories[b] - c.inferred.categories[a]; });
  var colors = Object.keys(c.inferred.colors).sort(function(a,b){ return c.inferred.colors[b] - c.inferred.colors[a]; });
  return '<div class="fade">' +
    '<h1>🧠 Profil IA</h1>' +
    '<div class="insight-card" style="margin-top:14px">' +
      '<div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:1.2px;font-weight:800">Utilisateur</div>' +
      '<div style="font-size:20px;font-weight:900;margin-top:6px">'+S.prof.name+'</div>' +
      '<div style="font-size:12.5px;opacity:.9;margin-top:4px">'+S.prof.age+' ans · '+S.prof.country+' · Phase '+c.phase+'/4</div>' +
    '</div>' +
    '<div class="card"><div class="coldstart-phase">' +
      '<div class="coldstart-icon">'+['🎯','📊','👥','🧠','✨'][c.phase]+'</div>' +
      '<div class="coldstart-body"><b>'+ColdStart.phaseLabel()+'</b>' +
      '<div class="mu">'+c.interactions+' interactions</div></div></div>' +
      '<div class="coldstart-progress"><i style="width:'+ColdStart.phaseProgress()+'%"></i></div>' +
    '</div>' +
    '<h2>📊 Statistiques</h2>' +
    '<div class="grid">' +
      '<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--ac)">'+c.signals.likes+'</div><div class="mu">J\'aime</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--ac)">'+c.signals.saves+'</div><div class="mu">Sauvegardes</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--ac)">'+c.signals.videoLikes+'</div><div class="mu">Vidéos aimées</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--ac)">'+c.signals.purchases+'</div><div class="mu">Achats</div></div>' +
    '</div>' +
    (cats.length ? '<h2>🎯 Catégories détectées</h2><div class="card">' + cats.slice(0,6).map(function(cat){
      var score = c.inferred.categories[cat];
      var max = Math.max.apply(null, cats.map(function(k){ return c.inferred.categories[k]; }));
      return '<div style="margin-top:10px"><div class="row sp" style="font-size:12px"><span>'+cat.toUpperCase()+'</span><span style="color:var(--ac);font-weight:800">'+score+'</span></div>' +
        '<div style="height:6px;background:var(--bd);border-radius:99px;overflow:hidden;margin-top:4px"><div style="height:100%;width:'+Math.round((score/max)*100)+'%;background:var(--grad);border-radius:99px"></div></div></div>';
    }).join('') + '</div>' : '') +
    (colors.length ? '<h2>🎨 Couleurs aimées</h2><div class="card"><div class="row wrap" style="gap:8px">' + colors.slice(0,5).map(function(colId){
      var col = COLORS.filter(function(x){ return x.id === colId; })[0];
      if(!col) return '';
      return '<div style="display:flex;align-items:center;gap:6px;background:var(--bg2);padding:5px 10px;border-radius:99px"><span style="width:14px;height:14px;border-radius:50%;background:'+col.hex+'"></span><span style="font-size:11.5px;font-weight:700">'+col.name+'</span></div>';
    }).join('') + '</div></div>' : '') +
    (c.inferred.avgPrice > 0 ? '<div class="card"><div class="row sp"><span>Budget détecté</span><b style="color:var(--ac)">'+cfa(c.inferred.avgPrice)+'</b></div></div>' : '') +
    '<button class="btn full" style="margin-top:14px" onclick="window.simulateInteractions()">⚡ Simuler 50 interactions</button>' +
    '<button class="btn o full" style="margin-top:8px" onclick="window.resetOnb()">🔄 Réinitialiser</button>' +
  '</div>';
};

/* CALENDAR */
V.calendar = function(){
  var year = S.calYear, month = S.calMonth;
  var firstDay = new Date(year, month, 1);
  var startWeekDay = firstDay.getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var daysInPrev = new Date(year, month, 0).getDate();

  var events = {};
  CALENDAR.forEach(function(ev){
    var d = new Date(ev.date);
    var key = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    if(!events[key]) events[key] = [];
    events[key].push(ev);
  });
  S.socialEvents.forEach(function(ev){
    var d = new Date(ev.date);
    var key = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    if(!events[key]) events[key] = [];
    events[key].push(ev);
  });

  var cells = '';
  for(var i = startWeekDay - 1; i >= 0; i--){
    cells += '<div class="cal-day other"><span class="cal-day-num">'+(daysInPrev - i)+'</span></div>';
  }
  for(var d = 1; d <= daysInMonth; d++){
    var evs = events[year + '-' + month + '-' + d] || [];
    var isToday = (year === TODAY.getFullYear() && month === TODAY.getMonth() && d === TODAY.getDate());
    var cls = 'cal-day';
    if(isToday) cls += ' today';
    if(evs.length > 0 && !isToday) cls += ' has-events';
    var dots = '';
    if(evs.length > 0){
      dots = '<div class="cal-dots">' + evs.slice(0,4).map(function(e){
        var t = e.type || 'social';
        return '<div class="cal-dot '+t+'"></div>';
      }).join('') + '</div>';
    }
    cells += '<div class="'+cls+'" onclick="window.selectDay('+year+','+month+','+d+')"><span class="cal-day-num">'+d+'</span>'+dots+'</div>';
  }
  var remaining = 42 - (startWeekDay + daysInMonth);
  if(remaining < 0) remaining = (7 - ((startWeekDay + daysInMonth) % 7)) % 7;
  for(var n = 1; n <= remaining; n++) cells += '<div class="cal-day other"><span class="cal-day-num">'+n+'</span></div>';

  return '<div class="fade">' +
    '<h1>📅 Calendrier</h1>' +
    '<div class="cal-nav">' +
      '<div class="cal-nav-btn" onclick="window.calPrev()">‹</div>' +
      '<div class="cal-month">'+monthName(month)+' '+year+'</div>' +
      '<div class="cal-nav-btn" onclick="window.calNext()">›</div>' +
    '</div>' +
    '<div class="cal-weekdays"><div>Dim</div><div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div></div>' +
    '<div class="cal-grid">'+cells+'</div>' +
    '<button class="btn full" style="margin-top:14px" onclick="window.openAddEvent()">+ Ajouter un événement</button>' +
  '</div>';
};

/* FRIENDS */
V.friends = function(){
  var all = S.friends.concat(S.friendRequests.map(function(f){ return Object.assign({}, f, {request:true}); }));
  var total = all.length || 1;
  var radius = 130;
  var items = '';
  all.forEach(function(f, i){
    var angle = (360 / total) * i - 90;
    var x = Math.cos(angle * Math.PI / 180) * radius;
    var y = Math.sin(angle * Math.PI / 180) * radius;
    var isReq = f.request === true;
    var cls = 'friends-circle-item' + (f.online ? ' online' : '');
    items += '<div class="'+cls+'" style="transform:translate('+x+'px,'+y+'px)" onclick="window.friendAction('+f.id+','+isReq+')">' +
      (f.photo ? '<img src="'+f.photo+'" alt="">' : (f.name[0] || '?')) +
    '</div>';
  });

  return '<div class="fade">' +
    '<h1>👥 Amis</h1>' +
    '<div class="mu" style="margin-top:4px">'+S.friends.length+' amis · '+S.friendRequests.length+' demande(s)</div>' +
    '<div class="friends-circle-wrap">' +
      '<div class="friends-circle-ring"></div>' +
      '<div class="friends-circle-center">'+(S.prof.name[0] || 'A')+'</div>' +
      items +
    '</div>' +
    '<div class="row" style="gap:8px;margin-bottom:14px">' +
      '<button class="btn full" onclick="window.toast(\'🔍 Chercher\')">🔍 Chercher</button>' +
      '<button class="btn g full" onclick="window.toast(\'📱 QR Code\')">📱 QR Code</button>' +
    '</div>' +
    (S.friendRequests.length ? '<h2>📩 Demandes</h2>' + S.friendRequests.map(function(f){
      return '<div class="card row"><div class="avatar" style="width:44px;height:44px;font-size:18px">'+(f.photo ? '<img src="'+f.photo+'" alt="">' : f.name[0])+'</div>' +
      '<div style="flex:1"><b style="font-size:13px">'+f.name+'</b><div class="mu">'+f.pseudo+'</div></div>' +
      '<div style="display:flex;gap:4px"><button class="btn sm" onclick="window.acceptFriend('+f.id+')">✓</button><button class="btn o sm" onclick="window.rejectFriend('+f.id+')">✕</button></div></div>';
    }).join('') : '') +
  '</div>';
};

/* LIBRARY */
V.library = function(){
  var tabs = ['J\'aime','Gardés','Historique','Sons'];
  var c = S.libraryTab || 0;
  var content = '';
  if(c === 0) content = S.likedProducts.length ? S.likedProducts.map(function(id){
    var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
    if(!p) return '';
    return '<div class="card row"><div class="th">' + imgTag(p.img, p.h, p.e) + '</div><div style="flex:1"><b style="font-size:13px">'+p.n+'</b><div class="mu">'+cfa(p.price)+'</div></div></div>';
  }).join('') : '<div class="empty"><span class="empty-icon">❤️</span>Aucun favori</div>';
  else if(c === 1) content = S.savedProducts.length ? S.savedProducts.map(function(id){
    var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
    if(!p) return '';
    return '<div class="card row"><div class="th">' + imgTag(p.img, p.h, p.e) + '</div><div style="flex:1"><b style="font-size:13px">'+p.n+'</b><div class="mu">'+cfa(p.price)+'</div></div></div>';
  }).join('') : '<div class="empty"><span class="empty-icon">🔖</span>Aucune sauvegarde</div>';
  else content = '<div class="empty"><span class="empty-icon">📚</span>Vide</div>';

  return '<div class="fade">' +
    '<h1>📚 Ma bibliothèque</h1>' +
    '<div class="mu" style="margin-top:4px">'+S.likedProducts.length+' aimés · '+S.savedProducts.length+' gardés</div>' +
    '<div class="scroll" style="margin-top:14px">' + tabs.map(function(t, i){
      return '<div class="chip '+(c === i ? 'on' : '')+'" onclick="window.setLibTab('+i+')">'+t+'</div>';
    }).join('') + '</div>' +
    content + '</div>';
};

/* MESSAGES */
V.msg = function(){
  return '<div class="fade">' +
    '<h1>💬 Messages</h1>' +
    '<div style="margin-top:14px">' +
      STORES.map(function(s){
        return '<div class="card row click" onclick="window.waOpen('+s.id+')">' +
          '<div class="th" style="background:var(--grad)">'+s.e+'</div>' +
          '<div style="flex:1"><b>'+s.n+'</b><div class="mu">Démarrer une conversation</div></div></div>';
      }).join('') +
    '</div></div>';
};

/* PROFILE */
V.profile = function(){
  var st = S.stats;
  return '<div class="fade">' +
    '<div style="display:flex;flex-direction:column;align-items:center;padding:20px 0 16px">' +
      '<div class="avatar" style="width:100px;height:100px;font-size:40px;cursor:pointer" onclick="window.changePhoto()">' +
        (S.prof.photo ? '<img src="'+S.prof.photo+'" alt="">' : (S.prof.name[0] || 'A')) +
      '</div>' +
      '<div style="font-size:20px;font-weight:800;margin-top:12px">'+(S.prof.name || 'Ami(e)')+'</div>' +
      '<div class="mu">@'+S.prof.name.replace(/\s+/g,'_').toLowerCase()+' · '+S.prof.age+' ans</div>' +
    '</div>' +

    '<div class="grid">' +
      '<div class="card" style="text-align:center"><div style="font-size:20px;font-weight:900;color:var(--ac)">'+st.profileViews+'</div><div class="mu">Visites</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:20px;font-weight:900;color:var(--ac)">'+st.videoViews+'</div><div class="mu">Vues vidéo</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:20px;font-weight:900;color:var(--ac)">'+st.sharedPosts+'</div><div class="mu">Partages</div></div>' +
      '<div class="card" style="text-align:center"><div style="font-size:20px;font-weight:900;color:var(--gold)">'+st.giftsReceived+'</div><div class="mu">Cadeaux</div></div>' +
    '</div>' +

    '<h2>Mon compte</h2>' +
    '<div class="settings-item" onclick="window.openSettings()">' +
      '<div class="ico">⚙️</div><div class="body"><b>Paramètres</b><div class="mu">Notifications, thème, langue</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'account\')">' +
      '<div class="ico">👤</div><div class="body"><b>Informations personnelles</b><div class="mu">Nom, email, téléphone</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'privacy\')">' +
      '<div class="ico">🔒</div><div class="body"><b>Confidentialité</b><div class="mu">Visibilité, données</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'legal\')">' +
      '<div class="ico">📜</div><div class="body"><b>Mentions légales</b><div class="mu">CGU, RGPD</div></div><span class="arrow">›</span></div>' +
    '<button class="btn o full" style="margin-top:14px" onclick="window.toggleTheme()">🌓 Changer de thème</button>' +
    '<button class="btn o full" style="margin-top:8px" onclick="window.resetOnb()">🔄 Réinitialiser</button>' +
  '</div>';
};

/* PRAYER */
V.prayer = function(){
  var nowMin = H*60 + new Date().getMinutes();
  var P = [{n:'Fajr',t:'05:30',e:'🌅'},{n:'Dhuhr',t:'13:15',e:'☀️'},{n:'Asr',t:'16:45',e:'🌤️'},{n:'Maghrib',t:'19:15',e:'🌆'},{n:'Isha',t:'20:30',e:'🌙'}];
  var next = P[0];
  for(var i=0;i<P.length;i++){ var pH = parseInt(P[i].t.split(':')[0]); if(pH*60 + 15 > nowMin){ next = P[i]; break; } }
  return '<div class="fade">' +
    '<h1>🕌 Mode Prière</h1>' +
    '<div style="background:linear-gradient(135deg,#0b7a43,#052e1a);color:#fff;border-radius:22px;padding:22px;margin:14px 0">' +
      '<div style="font-size:14px;font-weight:700;opacity:.95">'+next.e+' Prochaine : '+next.n+'</div>' +
      '<div style="font-size:44px;font-weight:900;letter-spacing:-2px;margin:8px 0">'+next.t+'</div>' +
    '</div>' +
    '<h2>🕐 Horaires</h2>' +
    P.map(function(p){
      var isPast = (parseInt(p.t.split(':')[0])*60 + parseInt(p.t.split(':')[1])) < nowMin;
      return '<div class="card row sp" style="'+(isPast ? 'opacity:.5' : '')+'">' +
        '<div class="row"><span style="font-size:22px">'+p.e+'</span><b>'+p.n+'</b></div>' +
        '<b style="color:var(--ac)">'+p.t+'</b></div>';
    }).join('') +
  '</div>';
};

/* SOCIAL */
V.social = function(){
  return '<div class="fade">' +
    '<h1>🎉 Événements</h1>' +
    '<button class="btn full" style="margin-top:14px" onclick="window.openAddEvent()">+ Créer un événement</button>' +
    (S.socialEvents.length ? '<h2>Mes événements</h2>' + S.socialEvents.map(function(ev, i){
      var d = new Date(ev.date);
      return '<div class="card"><div class="row sp"><div><b style="font-size:14px">'+ev.icon+' '+ev.name+'</b>' +
        '<div class="mu" style="margin-top:4px">'+(ev.desc || '')+'</div>' +
        '<div class="mu" style="margin-top:4px">📅 '+d.getDate()+' '+monthName(d.getMonth())+'</div></div>' +
        '<button class="btn r sm" onclick="window.deleteEvent('+i+')">🗑️</button></div></div>';
    }).join('') : '<div class="empty"><span class="empty-icon">🎉</span>Crée ton premier événement</div>') +
  '</div>';
};

/* CHALLENGE */
V.challenge = function(){
  return '<div class="fade">' +
    '<h1>🎯 Défi de la semaine</h1>' +
    '<div style="background:linear-gradient(135deg,#e0a526,#c88a1a);color:#0a0e1a;border-radius:22px;padding:20px;margin:14px 0;text-align:center">' +
      '<div style="font-size:56px;margin:10px 0">💛</div>' +
      '<h3 style="color:#0a0e1a;font-size:17px;margin-bottom:6px">Défi Jaune</h3>' +
      '<p style="font-size:13px;margin-bottom:14px">Porte une tenue jaune cette semaine</p>' +
      '<div style="background:rgba(0,0,0,.15);padding:8px 14px;border-radius:12px;font-size:12px;font-weight:800">🏆 Prix : Badge Or</div>' +
    '</div>' +
    '<button class="btn g full" onclick="window.participerChallenge()">📸 Participer</button>' +
    '<h2>🏆 Classement</h2>' +
    (S.challengeEntries.length ? S.challengeEntries.map(function(e, i){
      return '<div class="card row sp"><div class="row"><span style="font-size:20px">'+(i === 0 ? '🥇' : i === 1 ? '🥈' : '⭐')+'</span><b>'+e.name+'</b></div><span class="mu">'+e.likes+' ❤️</span></div>';
    }).join('') : '<div class="empty"><span class="empty-icon">🎯</span>Soyez la première !</div>') +
  '</div>';
};

/* MYSTERY */
V.mystery = function(){
  return '<div class="fade">' +
    '<h1>🎭 Styliste mystère</h1>' +
    '<div style="background:linear-gradient(135deg,#1e1b4b,#4c1d95);color:#fff;border-radius:22px;padding:22px;margin:14px 0;text-align:center">' +
      '<div style="width:80px;height:80px;border-radius:50%;background:var(--grad);display:grid;place-items:center;font-size:40px;margin:10px auto;border:3px solid rgba(255,255,255,.3)">'+(S.mystery.revealed ? '🌟' : '❓')+'</div>' +
      '<h3 style="color:#fff;margin-bottom:6px">'+(S.mystery.revealed ? 'Aïcha révélée !' : 'Styliste mystère')+'</h3>' +
      '<p style="font-size:12.5px;opacity:.9">'+(S.mystery.revealed ? 'Merci !' : 'Vote pour ta tenue préférée')+'</p>' +
    '</div>' +
    (!S.mystery.revealed ? '<div class="row" style="gap:8px">' + [1,2,3].map(function(n){
      return '<div class="card click" style="flex:1;text-align:center;padding:14px 8px" onclick="window.voteMystery('+n+')">' +
        '<div style="font-size:32px">'+['👗','🥻','👘'][n-1]+'</div><b style="font-size:11px;display:block;margin-top:6px">Tenue '+n+'</b></div>';
    }).join('') + '</div>' : '') +
  '</div>';
};

/* COFFRET */
V.coffret = function(){
  return '<div class="fade">' +
    '<h1>📦 Coffret surprise</h1>' +
    '<div style="background:linear-gradient(135deg,#7c2d12,#b45309);color:#fff;border-radius:22px;padding:20px;margin:14px 0">' +
      '<h3 style="color:#fff;font-size:16px;margin-bottom:8px">📦 BOX WEARLY</h3>' +
      '<div style="font-size:13px;opacity:.9;margin-bottom:14px">3-5 articles surprise selon ton profil</div>' +
      '<div style="background:rgba(0,0,0,.2);padding:14px;border-radius:14px"><div class="row sp"><b>Basic</b><b>15 000 FCFA</b></div>' +
      '<button class="btn full" style="margin-top:10px" onclick="window.subscribeBox(\'basic\')">S\'abonner</button></div>' +
      '<div style="background:rgba(0,0,0,.2);padding:14px;border-radius:14px;margin-top:10px"><div class="row sp"><b>Premium ⭐</b><b>35 000 FCFA</b></div>' +
      '<button class="btn g full" style="margin-top:10px" onclick="window.subscribeBox(\'premium\')">S\'abonner</button></div>' +
    '</div></div>';
};

/* RENTAL */
V.rental = function(){
  var items = [
    {n:'Grand Boubou Bazin',e:'🥻',price:'5 000 FCFA'},
    {n:'Robe de mariée',e:'👰',price:'25 000 FCFA'},
    {n:'Parure bijoux',e:'💎',price:'15 000 FCFA'}
  ];
  return '<div class="fade">' +
    '<h1>♻️ Location</h1>' +
    items.map(function(it){
      return '<div class="card"><div class="row sp"><div class="row"><div style="font-size:36px">'+it.e+'</div><div><b>'+it.n+'</b></div></div>' +
      '<b style="color:var(--ac)">'+it.price+'</b></div>' +
      '<button class="btn full" style="margin-top:10px" onclick="window.toast(\'📅 Réservé\')">Réserver</button></div>';
    }).join('') +
  '</div>';
};

/* CREATORS */
V.creators = function(){
  var cs = [
    {n:'Aminata Couture',e:'🧵',loc:'Médina',r:4.9},
    {n:'Sokhna Wax',e:'✂️',loc:'Plateau',r:4.8},
    {n:'Fashion Teranga',e:'✨',loc:'Almadies',r:4.9}
  ];
  return '<div class="fade">' +
    '<h1>🧵 Créateurs</h1>' +
    cs.map(function(c){
      return '<div class="card"><div class="row sp"><div class="row"><div style="font-size:36px">'+c.e+'</div>' +
      '<div><b>'+c.n+'</b><div class="mu">'+c.loc+'</div></div></div>' +
      '<b style="color:var(--gold)">⭐ '+c.r+'</b></div></div>';
    }).join('') +
  '</div>';
};

/* STUDIO */
V.studio = function(){
  return '<div class="fade">' +
    '<h1>🎵 Studio vidéo</h1>' +
    '<div style="width:100%;height:200px;border-radius:20px;background:linear-gradient(135deg,#1e1b4b,#4c1d95);display:grid;place-items:center;color:#fff;margin:14px 0">' +
      '<div style="text-align:center"><div style="font-size:60px">🎬</div><div style="margin-top:8px">Crée ta vidéo</div></div>' +
    '</div>' +
    '<h2>🎵 Musique</h2>' +
    ['Sabah El Kheir','Teranga Beat','Dakar Vibes','Sahel Sun'].map(function(m){
      return '<div class="card row click" onclick="window.toast(\'🎵 '+m+'\')"><div class="th" style="background:var(--grad)">🎵</div><div style="flex:1"><b>'+m+'</b><div class="mu">Libre de droits</div></div></div>';
    }).join('') +
    '<button class="btn g full" style="margin-top:14px" onclick="window.toast(\'📤 Vidéo publiée\')">📤 Publier</button>' +
  '</div>';
};

/* AR */
V.ar = function(){
  return '<div class="fade">' +
    '<h1>🪞 Essayage AR</h1>' +
    '<div style="width:100%;height:280px;border-radius:22px;background:linear-gradient(135deg,#0f172a,#1e293b);display:grid;place-items:center;color:#fff;margin:14px 0;border:2px dashed var(--ac)">' +
      '<div style="text-align:center"><div style="font-size:60px">👤</div><div style="margin-top:10px">Pointe vers toi</div></div>' +
    '</div>' +
    '<button class="btn full" onclick="window.toast(\'📸 Caméra activée\')">Activer</button>' +
  '</div>';
};

/* VOICE */
V.voice = function(){
  return '<div class="fade">' +
    '<h1>🎤 Styliste vocal</h1>' +
    '<div style="background:linear-gradient(135deg,#4c1d95,#831843);color:#fff;border-radius:22px;padding:22px;text-align:center;margin:14px 0">' +
      '<div style="font-size:14px;opacity:.9">Pose ta question</div>' +
      '<div style="width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.15);display:grid;place-items:center;font-size:44px;margin:14px auto;cursor:pointer;border:2px solid rgba(255,255,255,.3)" onclick="window.toast(\'🎤 Écoute...\')">🎤</div>' +
    '</div>' +
  '</div>';
};

/* JOURNAL */
V.journal = function(){
  return '<div class="fade">' +
    '<h1>📸 Journal de style</h1>' +
    '<div style="background:linear-gradient(135deg,#831843,#4c1d95);color:#fff;border-radius:22px;padding:24px;text-align:center;margin:14px 0">' +
      '<div style="font-size:48px;margin-bottom:8px">📸</div>' +
      '<div style="font-size:20px;font-weight:800">Mon année en tenues</div>' +
      '<div style="display:flex;justify-content:space-around;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.2)">' +
        '<div><div style="font-size:22px;font-weight:900">0</div><div style="font-size:10px;opacity:.85;margin-top:4px">Tenues</div></div>' +
        '<div><div style="font-size:22px;font-weight:900">0</div><div style="font-size:10px;opacity:.85;margin-top:4px">Événements</div></div>' +
        '<div><div style="font-size:22px;font-weight:900">0</div><div style="font-size:10px;opacity:.85;margin-top:4px">Jours</div></div>' +
      '</div>' +
    '</div>' +
    '<button class="btn g full" onclick="window.toast(\'📸 Ajouté\')">📸 Ajouter la tenue du jour</button>' +
  '</div>';
};

/* ============================================================
   SETTINGS
   ============================================================ */
function openSettings(){
  ov('<h1>⚙️ Paramètres</h1>' +
    '<div class="settings-item" onclick="window.openSub(\'notifications\')"><div class="ico">🔔</div><div class="body"><b>Notifications</b><div class="mu">Alertes push</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'appearance\')"><div class="ico">🎨</div><div class="body"><b>Apparence</b><div class="mu">Thème clair/sombre</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'language\')"><div class="ico">🌍</div><div class="body"><b>Langue</b><div class="mu">'+LANGUAGES.filter(function(l){return l.code === S.settings.language;})[0].name+'</div></div><span class="arrow">›</span></div>' +
    '<h3 style="margin-top:20px">Compte</h3>' +
    '<div class="settings-item" onclick="window.openSub(\'account\')"><div class="ico">👤</div><div class="body"><b>Informations personnelles</b><div class="mu">Nom, email, téléphone</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'privacy\')"><div class="ico">🔒</div><div class="body"><b>Confidentialité</b><div class="mu">Visibilité, données</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'legal\')"><div class="ico">📜</div><div class="body"><b>Mentions légales</b><div class="mu">CGU, RGPD</div></div><span class="arrow">›</span></div>' +
    '<div class="settings-item" onclick="window.openSub(\'support\')"><div class="ico">💬</div><div class="body"><b>Assistance</b><div class="mu">Aide et support</div></div><span class="arrow">›</span></div>');
}

function openSub(t){
  if(t === 'account'){
    ov('<h1>👤 Informations</h1>' +
      '<div style="margin-top:14px">' +
        '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">NOM</label>' +
        '<input id="sName" value="'+(S.prof.name||'')+'" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px;outline:none;margin-bottom:12px;font-family:inherit">' +
        '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">EMAIL</label>' +
        '<input id="sEmail" type="email" value="'+(S.prof.email||'')+'" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px;outline:none;margin-bottom:12px;font-family:inherit">' +
        '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">ADRESSE</label>' +
        '<input id="sAddr" value="'+(S.prof.address||'')+'" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px;outline:none;margin-bottom:14px;font-family:inherit">' +
        '<button class="btn full" onclick="window.saveAccount()">💾 Enregistrer</button>' +
      '</div>');
  }
  else if(t === 'notifications'){
    var nt = S.settings.notifications;
    ov('<h1>🔔 Notifications</h1>' +
      Object.keys(nt).map(function(k){
        return '<div class="settings-item"><div class="ico">'+({prayers:'🕌',events:'🎉',trends:'📈',orders:'📦',messages:'💬',friends:'👥'}[k])+'</div>' +
        '<div class="body"><b>'+k.charAt(0).toUpperCase()+k.slice(1)+'</b></div>' +
        '<div class="sw '+(nt[k]?'on':'')+'" onclick="window.toggleNotif(\''+k+'\')"></div></div>';
      }).join(''));
  }
  else if(t === 'appearance'){
    ov('<h1>🎨 Apparence</h1>' +
      '<div class="settings-item" onclick="window.toggleTheme();window.ov();window.openSub(\'appearance\')">' +
      '<div class="ico">'+(document.documentElement.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️')+'</div>' +
      '<div class="body"><b>Thème '+(document.documentElement.getAttribute('data-theme') === 'dark' ? 'Sombre' : 'Clair')+'</b>' +
      '<div class="mu">Appuyer pour changer</div></div></div>');
  }
  else if(t === 'language'){
    ov('<h1>🌍 Langue</h1>' + LANGUAGES.map(function(l){
      return '<div class="settings-item" onclick="window.setLang(\''+l.code+'\')">' +
        '<div class="ico">'+l.flag+'</div><div class="body"><b>'+l.name+'</b></div>' +
        (l.code === S.settings.language ? '<span style="color:var(--ac);font-size:20px">✓</span>' : '') + '</div>';
    }).join(''));
  }
  else if(t === 'privacy'){
    var p = S.settings.privacy;
    ov('<h1>🔒 Confidentialité</h1>' +
      '<div class="settings-item"><div class="ico">👁️</div><div class="body"><b>Profil public</b></div><div class="sw '+(p.publicProfile?'on':'')+'" onclick="window.togglePrivacy(\'publicProfile\')"></div></div>' +
      '<div class="settings-item"><div class="ico">📍</div><div class="body"><b>Localisation</b></div><div class="sw '+(p.showLocation?'on':'')+'" onclick="window.togglePrivacy(\'showLocation\')"></div></div>' +
      '<div class="settings-item"><div class="ico">📊</div><div class="body"><b>Statistiques</b></div><div class="sw '+(p.showStats?'on':'')+'" onclick="window.togglePrivacy(\'showStats\')"></div></div>' +
      '<div class="settings-item"><div class="ico">👗</div><div class="body"><b>Dressing visible</b></div><div class="sw '+(p.showDressing?'on':'')+'" onclick="window.togglePrivacy(\'showDressing\')"></div></div>');
  }
  else if(t === 'legal'){
    ov('<h1>📜 Mentions légales</h1>' +
      '<div class="card"><b>WEARLY SARL</b><div class="mu" style="margin-top:6px;line-height:1.7">Dakar, Sénégal<br>RCCM : SN-DKR-2026-B-XXXX<br>© 2026 WEARLY</div></div>' +
      '<div class="settings-item"><div class="ico">📄</div><div class="body"><b>CGU</b><div class="mu">Version 2.1</div></div><span class="arrow">›</span></div>' +
      '<div class="settings-item"><div class="ico">🔒</div><div class="body"><b>Politique de confidentialité</b><div class="mu">RGPD</div></div><span class="arrow">›</span></div>');
  }
  else if(t === 'support'){
    ov('<h1>💬 Assistance</h1>' +
      '<div class="settings-item"><div class="ico">💬</div><div class="body"><b>Chat en direct</b></div></div>' +
      '<div class="settings-item"><div class="ico">📞</div><div class="body"><b>+221 33 800 00 00</b></div></div>' +
      '<div class="settings-item"><div class="ico">📧</div><div class="body"><b>support@wearly.sn</b></div></div>');
  }
}

/* ============================================================
   ACTIONS
   ============================================================ */
function viewProduct(id){
  var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
  if(!p) return;
  ColdStart.track('productView', p);
  ColdStart.track('tap');
  ov('<div style="width:100%;height:300px;border-radius:22px;overflow:hidden;margin-bottom:14px;background:'+p.h+'">' +
    imgTag(p.img, p.h, '<div style="display:grid;place-items:center;height:100%;font-size:140px">'+p.e+'</div>') + '</div>' +
    '<h1>'+p.n+'</h1>' +
    '<div class="mu" style="margin-top:6px">⭐ '+p.rating+' · '+(p.gender === 'H' ? '👨' : '👩')+' · '+p.cat.toUpperCase()+'</div>' +
    '<div style="font-size:26px;font-weight:900;color:var(--ac);margin-top:12px">'+cfa(p.price)+'</div>' +
    '<div style="margin-top:14px;padding:12px;background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(59,130,246,.1));border-radius:14px">' +
      '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">🎯 Pertinence</div>' +
      '<div style="font-size:13.5px;font-weight:700">'+(p._score ? Math.round(p._score) : 50)+'% compatibilité</div>' +
      (p._reasons && p._reasons.length ? '<div class="mu" style="margin-top:6px">💡 '+p._reasons.join(' · ')+'</div>' : '') +
    '</div>' +
    '<div style="display:flex;flex-direction:column;gap:8px;margin-top:14px">' +
      '<button class="btn g full" style="padding:16px;font-size:14px" onclick="window.openGift('+p.id+')">🎁 OFFRIR CE PRODUIT</button>' +
      '<button class="btn full" onclick="window.toggleLike('+p.id+')">'+(S.likedProducts.indexOf(p.id) >= 0 ? '❤️ Aimé' : '🤍 Aimer')+'</button>' +
      '<button class="btn o full" onclick="window.toggleSave('+p.id+')">'+(S.savedProducts.indexOf(p.id) >= 0 ? '🔖 Sauvegardé' : '📌 Sauvegarder')+'</button>' +
    '</div>');
}

function openGift(productId){
  var p = PRODUCTS.filter(function(x){ return x.id === productId; })[0];
  if(!p) return;
  ov('<div style="text-align:center;margin-bottom:20px">' +
    '<div class="th" style="width:80px;height:80px;font-size:40px;margin:0 auto;background:'+p.h+'">'+imgTag(p.img, p.h, p.e)+'</div>' +
    '<h1 style="font-size:20px;margin-top:12px">'+p.n+'</h1>' +
    '<div class="mu">'+cfa(p.price)+'</div></div>' +
    '<h2 style="text-align:center">🎁 Qui est-ce pour ?</h2>' +
    '<div class="mu" style="text-align:center;margin-bottom:14px">Choisis le type de relation</div>' +
    '<div class="grid">' +
      GIFT_TYPES.map(function(t){
        return '<div class="gift-type" onclick="window.selectGift('+productId+',\''+t.id+'\')">' +
          '<div class="points">+'+t.points+'</div>' +
          '<span class="emoji">'+t.emoji+'</span>' +
          '<b>'+t.name+'</b>' +
          '<div class="mu">'+t.desc+'</div>' +
        '</div>';
      }).join('') +
    '</div>');
}

function selectGift(productId, typeId){
  var bonus = GiftSystem.offer(productId, typeId);
  var type = GIFT_TYPES.filter(function(t){ return t.id === typeId; })[0];
  var p = PRODUCTS.filter(function(x){ return x.id === productId; })[0];
  ov('<div style="text-align:center;padding:40px 20px">' +
    '<div style="font-size:80px;margin-bottom:16px">'+(type ? type.emoji : '🎁')+'</div>' +
    '<h1 style="font-size:24px">Cadeau envoyé !</h1>' +
    '<div style="font-size:14px;margin-top:12px">'+p.n+' → '+(type ? type.name : '')+'</div>' +
    '<div style="background:var(--grad-gold);color:#0a0e1a;padding:20px;border-radius:20px;margin-top:20px;font-weight:900">' +
      '<div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:.7">Points gagnés</div>' +
      '<div style="font-size:44px;line-height:1;margin:6px 0">+'+bonus+'</div>' +
      '<div style="font-size:12px;opacity:.7">Total : '+S.gift.points+' points</div>' +
    '</div>' +
    '<button class="btn full" style="margin-top:20px" onclick="window.ov();window.goTab(\'gifts\')">🎁 Voir mes cadeaux</button>' +
  '</div>');
}

function toggleLike(id){
  var idx = S.likedProducts.indexOf(id);
  if(idx >= 0){ S.likedProducts.splice(idx, 1); }
  else { S.likedProducts.push(id); ColdStart.track('like'); toast('❤️ Ajouté'); }
  viewProduct(id);
}

function toggleSave(id){
  var idx = S.savedProducts.indexOf(id);
  if(idx >= 0){ S.savedProducts.splice(idx, 1); toast('Retiré'); }
  else { S.savedProducts.push(id); ColdStart.track('save'); toast('🔖 Sauvegardé'); }
  viewProduct(id);
}

function trackVideoView(id, tags){
  ColdStart.track('videoLike');
  var p = PRODUCTS.filter(function(pr){ return tags.split(',').indexOf(pr.cat) >= 0; })[0];
  if(p) ColdStart.track('productView', p);
}

function trackVideoLike(id, tags){
  var key = 'v'+id;
  var idx = S.likedProducts.indexOf(key);
  if(idx >= 0) S.likedProducts.splice(idx, 1);
  else { S.likedProducts.push(key); ColdStart.track('videoLike'); toast('❤️'); }
  go();
}

function simulateInteractions(){
  for(var i=0;i<50;i++){
    var g = S.prof.sex;
    var pool = PRODUCTS.filter(function(p){ return p.gender === g; });
    var rp = pool[Math.floor(Math.random() * pool.length)];
    ColdStart.track('productView', rp);
    if(Math.random() > 0.7) ColdStart.track('like');
  }
  toast('⚡ 50 interactions simulées');
  go();
}

function selectDay(year, month, day){
  var list = CALENDAR.filter(function(ev){
    var d = new Date(ev.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
  var customs = S.socialEvents.filter(function(ev){
    var d = new Date(ev.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
  var all = list.concat(customs.map(function(c){ return {name:c.name, icon:c.icon, desc:c.desc, type:'social'}; }));

  var html = '<h1>'+dayName(new Date(year, month, day).getDay())+' '+day+' '+monthName(month)+'</h1>';
  if(!all.length){
    html += '<div class="empty"><span class="empty-icon">📅</span>Aucun événement</div>' +
      '<button class="btn full" style="margin-top:14px" onclick="window.ov();window.openAddEvent()">+ Ajouter</button>';
  } else {
    html += '<div class="mu" style="margin-top:4px">'+all.length+' événement(s)</div>';
    all.forEach(function(ev){
      html += '<div class="day-event '+(ev.type||'social')+'">' +
        '<div style="font-size:30px;flex-shrink:0">'+(ev.icon || '📅')+'</div>' +
        '<div style="flex:1"><b style="font-size:14px;display:block;margin-bottom:4px">'+ev.name+'</b>' +
        '<div class="mu">'+(ev.desc || '')+'</div></div></div>';
    });
  }
  ov(html);
}

function openAddEvent(){
  ov('<h1>📅 Nouvel événement</h1>' +
    '<div style="margin-top:14px">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">NOM</label>' +
      '<input id="evName" placeholder="Ex: Mariage de Fatou" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px;outline:none;margin-bottom:12px;font-family:inherit">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">DATE</label>' +
      '<input type="date" id="evDate" value="'+new Date(Date.now()+7*86400000).toISOString().slice(0,10)+'" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px;outline:none;margin-bottom:12px;font-family:inherit">' +
      '<label style="font-size:12px;font-weight:800;color:var(--mu);display:block;margin-bottom:6px">TYPE</label>' +
      '<div class="row wrap" style="gap:6px;margin-bottom:12px">' +
        [{id:'birthday',e:'🎂',n:'Anniversaire'},{id:'wedding',e:'💍',n:'Mariage'},{id:'party',e:'🎊',n:'Soirée'},{id:'family',e:'👨‍👩‍👧',n:'Famille'}].map(function(t){
          return '<div class="chip" data-evtype="'+t.id+'" onclick="window.selEvType(\''+t.id+'\')">'+t.e+' '+t.n+'</div>';
        }).join('') +
      '</div>' +
      '<button class="btn full" onclick="window.saveEvent()">✨ Créer</button>' +
    '</div>');
}

var _selEvType = null;
function selEvType(id){
  _selEvType = id;
  $$('[data-evtype]').forEach(function(el){ el.classList.toggle('on', el.dataset.evtype === id); });
}

function saveEvent(){
  var n = $('#evName').value.trim();
  var d = $('#evDate').value;
  if(!n || !d){ toast('⚠️ Nom et date obligatoires'); return; }
  var typeInfo = [{id:'birthday',e:'🎂',n:'Anniversaire'},{id:'wedding',e:'💍',n:'Mariage'},{id:'party',e:'🎊',n:'Soirée'},{id:'family',e:'👨‍👩‍👧',n:'Famille'}].filter(function(t){ return t.id === _selEvType; })[0] || {e:'🎉',n:'Événement'};
  S.socialEvents.push({name:n, icon:typeInfo.e, date:d, desc:typeInfo.n, type:'social'});
  _selEvType = null;
  ov();
  toast('✅ Événement créé');
  go();
}

function acceptFriend(id){
  var idx = S.friendRequests.findIndex(function(f){ return f.id === id; });
  if(idx >= 0){ S.friends.push(S.friendRequests[idx]); S.friendRequests.splice(idx, 1); toast('✅ Ami ajouté'); go(); }
}
function rejectFriend(id){
  S.friendRequests = S.friendRequests.filter(function(f){ return f.id !== id; });
  toast('Refusé'); go();
}
function friendAction(id, isReq){
  if(isReq){
    var f = S.friendRequests.filter(function(x){ return x.id === id; })[0];
    if(f) ov('<h1>'+f.name+'</h1><button class="btn full" onclick="window.acceptFriend('+id+')">Accepter</button><button class="btn o full" style="margin-top:8px" onclick="window.rejectFriend('+id+')">Refuser</button>');
  } else {
    var f2 = S.friends.filter(function(x){ return x.id === id; })[0];
    if(f2) ov('<h1>'+f2.name+'</h1><div class="mu">'+f2.pseudo+'</div><button class="btn full" style="margin-top:14px" onclick="window.toast(\'💬 Message\')">💬 Message</button>');
  }
}

function waOpen(id){
  S.chats[id] = S.chats[id] || [{f:'in', t:'Teranga ! Comment pouvons-nous aider ?', time:now()}];
  var s = STORES.filter(function(x){ return x.id === id; })[0];
  ov('<div class="row" style="margin-bottom:14px"><div class="th" style="background:var(--grad)">'+s.e+'</div><div style="flex:1"><b>'+s.n+'</b></div></div>' +
    S.chats[id].map(function(m){ return '<div style="padding:10px 14px;border-radius:14px;margin:6px 0;max-width:80%;background:'+(m.f === 'out' ? 'var(--ac);color:#fff;margin-left:auto' : 'var(--card)')+'">'+m.t+'</div>'; }).join(''));
}

function calPrev(){ S.calMonth--; if(S.calMonth < 0){ S.calMonth = 11; S.calYear--; } go(); }
function calNext(){ S.calMonth++; if(S.calMonth > 11){ S.calMonth = 0; S.calYear++; } go(); }

function changePhoto(){
  S.prof.photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';
  ov(); toast('📸 Photo mise à jour'); go();
}

function toggleTheme(){
  var cur = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
  go();
}

function resetOnb(){
  if(!confirm('Réinitialiser l\'app ?')) return;
  /* ---------- Effacer l'état sauvegardé ---------- */
  if (window.AppState) window.AppState.clear();
  S.ob = 0;
  S.obData = {name:'', sex:'', age:25, country:'SN', phone:'', stylePref:'', budget:20000, colors:[]};
  S.prof = {name:'', sex:'', age:25, country:'SN', photo:null, style:'', budget:20000, colors:[], address:'', email:''};
  S.cold = {phase:0, interactions:0, signals:{views:0,likes:0,saves:0,purchases:0,videoLikes:0,taps:0}, inferred:{categories:{}, colors:{}, avgPrice:0, priceHits:[]}};
  S.gift = {points:0, history:[], totalSent:0, badges:[]};
  S.likedProducts = []; S.savedProducts = []; S.socialEvents = []; S.notifications = [];
  var ob = $('#onb'); ob.style.display = 'flex'; ob.style.opacity = '1'; ob.innerHTML = '';
  document.documentElement.setAttribute('data-gender', 'H');
  renderOnb();
}

/* ============================================================
   EXPORTS
   ============================================================ */
window.goTab = goTab;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.ov = ov;
window.toast = toast;
window.viewProduct = viewProduct;
window.openGift = openGift;
window.selectGift = selectGift;
window.toggleLike = toggleLike;
window.toggleSave = toggleSave;
window.trackVideoView = trackVideoView;
window.trackVideoLike = trackVideoLike;
window.simulateInteractions = simulateInteractions;
window.setShopGender = function(g){ S.shopGender = g; go(); };
window.setShopCat = function(c){ S.filterCat = c; go(); };
window.setLibTab = function(i){ S.libraryTab = i; go(); };
window.selectDay = selectDay;
window.openAddEvent = openAddEvent;
window.selEvType = selEvType;
window.saveEvent = saveEvent;
window.deleteEvent = function(i){ S.socialEvents.splice(i, 1); go(); toast('Supprimé'); };
window.calPrev = calPrev;
window.calNext = calNext;
window.acceptFriend = acceptFriend;
window.rejectFriend = rejectFriend;
window.friendAction = friendAction;
window.waOpen = waOpen;
window.changePhoto = changePhoto;
window.toggleTheme = toggleTheme;
window.resetOnb = resetOnb;
window.obSkip = obSkip;
window.finishOnb = finishOnb;
window.openSettings = openSettings;
window.openSub = openSub;
window.toggleNotif = function(k){ S.settings.notifications[k] = !S.settings.notifications[k]; openSub('notifications'); };
window.togglePrivacy = function(k){ S.settings.privacy[k] = !S.settings.privacy[k]; openSub('privacy'); };
window.setLang = function(c){ S.settings.language = c; ov(); toast('🌍 Langue changée'); };
window.saveAccount = function(){
  S.prof.name = ($('#sName').value || S.prof.name).trim();
  S.prof.email = ($('#sEmail').value || '').trim();
  S.prof.address = ($('#sAddr').value || '').trim();
  ov(); toast('💾 Enregistré'); go();
};
window.participerChallenge = function(){ S.challengeEntries.push({name:S.prof.name, likes:Math.floor(Math.random()*100)+20}); toast('🎉 Participation !'); go(); };
window.voteMystery = function(n){ S.mystery.votes++; if(S.mystery.votes >= 3){ S.mystery.revealed = true; confetti(); } toast('✅ Vote '+n); go(); };
window.subscribeBox = function(p){ confetti(); toast('🎉 Abonnement '+p); };

/* INIT */
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-gender', 'H');
/* ===== VESTIAIRE AMIS : PRÊT & LOCATION ===== */
var fm=function(n){return n.toLocaleString('fr-FR')+' FCFA'};
var dt=function(n){var d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
var VF=[{id:1,n:'Fatou Diop'},{id:2,n:'Moussa Ndiaye'},{id:3,n:'Awa Sow'}];
var VI=[{id:101,o:1,n:'Grand boubou bazin indigo',e:'🥻',z:'L',m:'both',p:5000,d:15000},{id:102,o:1,n:'Robe wax de cérémonie',e:'👗',z:'M',m:'rent',p:6000,d:20000},{id:103,o:2,n:'Costume bleu nuit',e:'🤵',z:'L',m:'both',p:7000,d:25000},{id:104,o:2,n:'Babouches en cuir',e:'🥿',z:'42',m:'lend',p:0,d:0},{id:105,o:3,n:'Caftan brodé',e:'👘',z:'M',m:'both',p:5500,d:18000},{id:106,o:3,n:'Parure bijoux dorée',e:'💎',z:'-',m:'rent',p:3000,d:30000}];
S.vest={tab:'amis',fr:1,t:'lend',f:dt(1),to:dt(3),nid:2,mine:[{id:201,o:0,n:'Blazer beige',e:'🧥',z:'M',m:'lend',p:0,d:0},{id:202,o:0,n:'Tenue traditionnelle homme',e:'🥻',z:'L',m:'rent',p:5000,d:15000},{id:203,o:0,n:'Sneakers blanches',e:'👟',z:'42',m:'off',p:0,d:0}],reqs:[{id:1,it:202,t:'rent',f:dt(3),to:dt(5),days:3,fee:15000,dep:15000,st:'wait',dir:'in',who:3}]};
var STL={wait:'⏳ En attente',ok:'✅ Accepté',out:'🤝 Remis',back:'↩️ Rendu',no:'❌ Refusé'};
function vAll(){return VI.concat(S.vest.mine)}
function vIt(id){return vAll().filter(function(i){return i.id===id})[0]}
function vFr(id){return VF.filter(function(f){return f.id===id})[0]||{n:'Moi'}}
function vBusy(id,a,b){return S.vest.reqs.some(function(r){return r.it===id&&(r.st==='ok'||r.st==='out')&&!(b<r.f||a>r.to)})}
function vTag(i){return(i.m==='lend'||i.m==='both'?'<span class="chip on" style="font-size:10px;padding:3px 8px">🤝 Prêt gratuit</span> ':'')+(i.m==='rent'||i.m==='both'?'<span class="chip" style="font-size:10px;padding:3px 8px;border-color:var(--gold)">♻️ '+fm(i.p)+'/jour</span>':'')}
function vCard(i){var busy=vBusy(i.id,dt(0),dt(2));return'<div class="card click" onclick="window.vOpen('+i.id+')"><div class="row"><div style="font-size:42px">'+i.e+'</div><div style="flex:1"><b>'+i.n+'</b><div class="mu">Taille '+i.z+' · '+vFr(i.o).n+(busy?' · 🔒 Réservé':' · 🟢 Disponible')+'</div><div style="margin-top:6px">'+vTag(i)+'</div></div><span style="color:var(--gold);font-size:22px">›</span></div></div>'}
function vReq(r){var i=vIt(r.it),inc=r.dir==='in',b='';
if(inc){if(r.st==='wait')b='<button class="btn sm" onclick="window.vAct('+r.id+',\'ok\')">Accepter</button> <button class="btn o sm" onclick="window.vAct('+r.id+',\'no\')">Refuser</button>';if(r.st==='ok')b='<button class="btn sm" onclick="window.vAct('+r.id+',\'out\')">Remis à l’ami</button>';if(r.st==='out')b='<button class="btn sm" onclick="window.vAct('+r.id+',\'back\')">Retour reçu</button>'}
else{if(r.st==='wait')b='<button class="btn o sm" onclick="window.vAct('+r.id+',\'ok\')">Simuler : l’ami accepte</button>';if(r.st==='ok')b='<button class="btn sm" onclick="window.vAct('+r.id+',\'out\')">J’ai récupéré</button>';if(r.st==='out')b='<button class="btn sm" onclick="window.vAct('+r.id+',\'back\')">Je l’ai rendu</button>'}
var left=Math.round((new Date(r.to)-new Date(dt(0)))/864e5);
return'<div class="card"><div class="row sp"><b>'+i.e+' '+i.n+'</b><span class="chip on" style="font-size:10px">'+STL[r.st]+'</span></div><div class="mu" style="margin:4px 0">'+(inc?'Demande de ':'Chez ')+vFr(r.who).n+' · '+(r.t==='rent'?'Location':'Prêt')+' · '+r.f+' → '+r.to+' ('+r.days+' j)</div>'+(r.t==='rent'?'<div class="mu">Location '+fm(r.fee)+' · Caution '+fm(r.dep)+' (rendue au retour)</div>':'')+(r.st==='out'?'<div style="color:var(--gold);font-weight:800;font-size:12.5px;margin:4px 0">⏰ Retour '+(left<0?'en retard de '+(-left)+' j':left===0?'aujourd’hui':'dans '+left+' j')+'</div>':'')+(b?'<div style="margin-top:8px">'+b+'</div>':'')+'</div>'}
V.vestiaire=function(){var v=S.vest,np=v.reqs.filter(function(r){return r.st==='wait'}).length,T=[['amis','👥 Amis'],['rent','♻️ Location'],['reqs','📋 Suivi'+(np?' ('+np+')':'')],['mine','👗 Mes articles']],h='';
if(v.tab==='amis'){var f=vFr(v.fr);h='<div class="row scroll" style="margin:10px 0">'+VF.map(function(x){return'<span class="chip '+(v.fr===x.id?'on':'')+'" onclick="window.vSet(\'fr\','+x.id+')">'+x.n+'</span>'}).join('')+'</div><h2>Vestiaire de '+f.n+'</h2>'+(VI.filter(function(i){return i.o===v.fr}).map(vCard).join(''))}
else if(v.tab==='rent')h='<div class="mu" style="margin:6px 0">Louez entre amis, à petit prix, pour une cérémonie ou une soirée.</div>'+VI.filter(function(i){return i.m==='rent'||i.m==='both'}).map(vCard).join('');
else if(v.tab==='reqs')h=(v.reqs.length?v.reqs.slice().reverse().map(vReq).join(''):'<div class="card mu">Aucun prêt ni location pour l’instant.</div>');
else h='<div class="mu" style="margin:6px 0">🔒 Visibles uniquement par tes amis. Choisis ce que tu partages.</div>'+v.mine.map(function(i){return'<div class="card"><div class="row"><div style="font-size:34px">'+i.e+'</div><div style="flex:1"><b>'+i.n+'</b><div class="mu">Taille '+i.z+'</div></div></div><div class="row wrap" style="margin-top:8px">'+[['off','Privé'],['lend','🤝 Prêt'],['rent','♻️ Location'],['both','Les deux']].map(function(m){return'<span class="chip '+(i.m===m[0]?'on':'')+'" onclick="window.vMode('+i.id+',\''+m[0]+'\')">'+m[1]+'</span>'}).join('')+'</div>'+((i.m==='rent'||i.m==='both')?'<div class="row sp" style="margin-top:8px"><span class="mu">Prix par jour</span><div class="row"><button class="btn o sm" onclick="window.vPrice('+i.id+',-500)">−</button><b>'+fm(i.p)+'</b><button class="btn o sm" onclick="window.vPrice('+i.id+',500)">+</button></div></div>':'')+'</div>'}).join('');
return'<div class="fade"><h1>👗 Vestiaire des amis</h1><div class="row scroll" style="margin:12px 0">'+T.map(function(t){return'<span class="chip '+(v.tab===t[0]?'on':'')+'" onclick="window.vSet(\'tab\',\''+t[0]+'\')">'+t[1]+'</span>'}).join('')+'</div>'+h+'</div>'};
V.rental=function(){S.vest.tab='rent';return V.vestiaire()};
function vSum(i){var v=S.vest,a=new Date(v.f),b=new Date(v.to),d=Math.round((b-a)/864e5)+1,ok=v.f&&v.to&&d>=1&&v.f>=dt(0);if(!ok)return{ok:false,days:0,fee:0,dep:0};var r=v.t==='rent';return{ok:true,days:d,fee:r?d*i.p:0,dep:r?i.d:0}}
window.vOpen=function(id){var i=vIt(id),v=S.vest;if(i.o===0)return;if(i.m!=='both')v.t=i.m;var s=vSum(i);
ov('<div class="fade"><div style="font-size:70px;text-align:center">'+i.e+'</div><h1>'+i.n+'</h1><div class="mu">Taille '+i.z+' · à '+vFr(i.o).n+'</div><div class="row wrap" style="margin:12px 0">'+(i.m==='both'?['lend','rent'].map(function(t){return'<span class="chip '+(v.t===t?'on':'')+'" onclick="window.vType('+id+',\''+t+'\')">'+(t==='lend'?'🤝 Prêt gratuit':'♻️ Location')+'</span>'}).join(''):'<span class="chip on">'+(i.m==='lend'?'🤝 Prêt gratuit':'♻️ Location')+'</span>')+'</div><div class="row" style="gap:8px"><div style="flex:1"><div class="mu">Du</div><input type="date" value="'+v.f+'" min="'+dt(0)+'" onchange="window.vDate(\'f\',this.value,'+id+')" style="width:100%;padding:10px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx)"></div><div style="flex:1"><div class="mu">Au</div><input type="date" value="'+v.to+'" min="'+dt(0)+'" onchange="window.vDate(\'to\',this.value,'+id+')" style="width:100%;padding:10px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx)"></div></div><div class="card" id="vsum" style="margin-top:12px">'+vSumHtml(i,s)+'</div><button class="btn full" onclick="window.vSend('+id+')">Envoyer la demande à '+vFr(i.o).n.split(' ')[0]+'</button><div class="mu" style="margin-top:8px">Démo : aucun paiement réel. Le règlement se fait à la remise entre amis.</div></div>')};
function vSumHtml(i,s){if(!s.ok)return'<span class="mu">Choisis des dates valides (à partir d’aujourd’hui).</span>';return'<div class="row sp"><span>Durée</span><b>'+s.days+' jour(s)</b></div>'+(S.vest.t==='rent'?'<div class="row sp"><span>Location</span><b>'+fm(s.fee)+'</b></div><div class="row sp"><span>Caution (remboursée)</span><b>'+fm(s.dep)+'</b></div><div class="row sp" style="margin-top:6px"><b>À prévoir</b><b style="color:var(--gold)">'+fm(s.fee+s.dep)+'</b></div>':'<div class="row sp"><span>Prêt</span><b style="color:var(--gold)">Gratuit</b></div>')}
window.vDate=function(k,val,id){S.vest[k]=val;var i=vIt(id);$('#vsum').innerHTML=vSumHtml(i,vSum(i))};
window.vType=function(id,t){S.vest.t=t;window.vOpen(id)};
window.vSet=function(k,val){S.vest[k]=val;go()};
window.vMode=function(id,m){vIt(id).m=m;go()};
window.vPrice=function(id,d){var i=vIt(id);i.p=Math.max(500,i.p+d);go()};
window.vSend=function(id){var i=vIt(id),v=S.vest,s=vSum(i);if(!s.ok){toast('Dates invalides');return}if(vBusy(id,v.f,v.to)){toast('🔒 Déjà réservé à ces dates');return}v.reqs.push({id:v.nid++,it:id,t:v.t,f:v.f,to:v.to,days:s.days,fee:s.fee,dep:s.dep,st:'wait',dir:'out',who:i.o});ov();v.tab='reqs';toast('📩 Demande envoyée');go()};
window.vAct=function(id,a){var r=S.vest.reqs.filter(function(x){return x.id===id})[0];if(a==='ok'&&vBusy(r.it,r.f,r.to)){toast('🔒 Dates déjà prises');return}r.st=a;toast(STL[a]);if(window.WEARLY)window.WEARLY.emit('loan:'+a,{req:r,item:vIt(r.it)});go()};
var oH2=V.home;V.home=function(){var h=oH2(),n=VI.filter(function(i){return i.m!=='off'}).length,p=S.vest.reqs.filter(function(r){return r.st==='wait'}).length;return h.replace('<h2>✨ Recommandé pour toi</h2>','<div class="card click" onclick="window.goTab(\'vestiaire\')" style="background:linear-gradient(135deg,#a855f7,#7e22ce);color:#fff;border:0"><div class="row"><div style="font-size:36px">👗</div><div style="flex:1"><b>Vestiaire des amis</b><div style="font-size:12.5px;opacity:.9">'+n+' articles à emprunter ou louer'+(p?' · '+p+' demande(s)':'')+'</div></div><span style="font-size:24px">›</span></div></div><h2>✨ Recommandé pour toi</h2>')};
var oF=V.friends;V.friends=function(){return oF().replace('<div class="row" style="gap:8px;margin-bottom:14px">','<button class="btn g full" style="margin-bottom:12px" onclick="window.goTab(\'vestiaire\')">👗 Vestiaire des amis · prêt & location</button><div class="row" style="gap:8px;margin-bottom:14px">')};

window.WEARLY_UI={V:V,S:S,toast:toast,ov:ov,go:function(){go()},goTab:goTab};

/* ============================================================
   BOOT : exposition globale + chargement de l'état sauvegardé
   ============================================================ */
window.S = S;
window.__wearlyRefresh = function(){ go(); };

function bootWearly(){
  function start(){
    var obEl = document.getElementById('onb');
    if (S.ob >= 8) {
      if (obEl) obEl.style.display = 'none';
      if (window.AppState) console.log('[WEARLY] moteur de stockage :', window.AppState.engine());
      go();
    } else {
      renderOnb();
    }
  }
  if (window.AppState) {
    window.AppState.load(S).then(start).catch(start);
  } else {
    start();
  }
}
bootWearly();

/* Sauvegarde à la fermeture / mise en arrière-plan */
window.addEventListener('beforeunload', function(){
  if (window.AppState) window.AppState.flush(S);
});
document.addEventListener('pause', function(){
  if (window.AppState) window.AppState.flush(S);
}, false);
document.addEventListener('visibilitychange', function(){
  if (document.hidden && window.AppState) window.AppState.flush(S);
});

})();
