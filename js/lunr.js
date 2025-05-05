/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
 * Copyright (C) 2020 Oliver Nightingale
 * @license MIT
 */
!function(){var e=function(t){var r=new e.Builder;return r.pipeline.add(e.trimmer,e.stopWordFilter,e.stemmer),r.searchPipeline.add(e.stemmer),t.call(r,r),r.build()};e.version="2.3.9",e.utils={},e.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),e.utils.asString=function(e){return void 0===e||null===e?"":e.toString()},e.utils.clone=function(e){if(null===e||void 0===e)return e;for(var t=Object.create(null),r=Object.keys(e),i=0;i<r.length;i++){var n=r[i],s=e[n];if(Array.isArray(s))t[n]=s.slice();else{if("string"!=typeof s&&"number"!=typeof s&&"boolean"!=typeof s)throw new TypeError("clone is not deep and does not support nested objects");t[n]=s}}return t},e.FieldRef=function(e,t,r){this.docRef=e,this.fieldName=t,this._stringValue=r},e.FieldRef.joiner="/",e.FieldRef.fromString=function(t){var r=t.indexOf(e.FieldRef.joiner);if(r===-1)throw"malformed field ref string";var i=t.slice(0,r),n=t.slice(r+1);return new e.FieldRef(n,i,t)},e.FieldRef.prototype.toString=function(){return void 0==this._stringValue&&(this._stringValue=this.fieldName+e.FieldRef.joiner+this.docRef),this._stringValue},e.Set=function(e){if(this.elements=Object.create(null),e){this.length=e.length;for(var t=0;t<this.length;t++)this.elements[e[t]]=!0}else this.length=0},e.Set.complete={intersect:function(e){return e},union:function(){return this},contains:function(){return!0}},e.Set.empty={intersect:function(){return this},union:function(e){return e},contains:function(){return!1}},e.Set.prototype.contains=function(e){return!!this.elements[e]},e.Set.prototype.intersect=function(t){var r,i,n,s=[];if(t===e.Set.complete)return this;if(t===e.Set.empty)return t;this.length<t.length?(r=this,i=t):(r=t,i=this),n=Object.keys(r.elements);for(var o=0;o<n.length;o++){var a=n[o];a in i.elements&&s.push(a)}return new e.Set(s)},e.Set.prototype.union=function(t){return t===e.Set.complete?e.Set.complete:t===e.Set.empty?this:new e.Set(Object.keys(this.elements).concat(Object.keys(t.elements)))},e.idf=function(e,t){var r=0;for(var i in e)"_index"!=i&&(r+=Object.keys(e[i]).length);var n=(t-r+.5)/(r+.5);return Math.log(1+Math.abs(n))},e.Token=function(e,t){this.str=e||"",this.metadata=t||{}},e.Token.prototype.toString=function(){return this.str},e.Token.prototype.update=function(e){return this.str=e(this.str,this.metadata),this},e.Token.prototype.clone=function(t){return t=t||function(e){return e},new e.Token(t(this.str,this.metadata),this.metadata)},e.tokenizer=function(t,r){if(null==t||void 0==t)return[];if(Array.isArray(t))return t.map(function(t){return new e.Token(e.utils.asString(t).toLowerCase(),e.utils.clone(r))});for(var i=t.toString().toLowerCase(),n=i.length,s=[],o=0,a=0;o<=n;o++){var u=i.charAt(o),l=o-a;if(u.match(e.tokenizer.separator)||o==n){if(l>0){var c=e.utils.clone(r)||{};c.position=[a,l],c.index=s.length,s.push(new e.Token(i.slice(a,o),c))}a=o+1}}return s},e.tokenizer.separator=/[\s\-]+/,e.Pipeline=function(){this._stack=[]},e.Pipeline.registeredFunctions=Object.create(null),e.Pipeline.registerFunction=function(t,r){r in this.registeredFunctions&&e.utils.warn("Overwriting existing registered function: "+r),t.label=r,e.Pipeline.registeredFunctions[t.label]=t},e.Pipeline.warnIfFunctionNotRegistered=function(t){var r=t.label&&t.label in this.registeredFunctions;r||e.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",t)},e.Pipeline.load=function(t){var r=new e.Pipeline;return t.forEach(function(t){var i=e.Pipeline.registeredFunctions[t];if(!i)throw new Error("Cannot load unregistered function: "+t);r.add(i)}),r},e.Pipeline.prototype.add=function(){var t=Array.prototype.slice.call(arguments);t.forEach(function(t){e.Pipeline.warnIfFunctionNotRegistered(t),this._stack.push(t)},this)},e.Pipeline.prototype.after=function(t,r){e.Pipeline.warnIfFunctionNotRegistered(r);var i=this._stack.indexOf(t);if(i==-1)throw new Error("Cannot find existingFn");i+=1,this._stack.splice(i,0,r)},e.Pipeline.prototype.before=function(t,r){e.Pipeline.warnIfFunctionNotRegistered(r);var i=this._stack.indexOf(t);if(i==-1)throw new Error("Cannot find existingFn");this._stack.splice(i,0,r)},e.Pipeline.prototype.remove=function(e){var t=this._stack.indexOf(e);t!=-1&&this._stack.splice(t,1)},e.Pipeline.prototype.run=function(e){for(var t=this._stack.length,r=0;r<t;r++){for(var i=this._stack[r],n=[],s=0;s<e.length;s++){var o=i(e[s],s,e);if(null!==o&&void 0!==o&&""!==o)if(Array.isArray(o))for(var a=0;a<o.length;a++)n.push(o[a]);else n.push(o)}e=n}return e},e.Pipeline.prototype.runString=function(t,r){var i=new e.Token(t,r);return this.run([i]).map(function(e){return e.toString()})},e.Pipeline.prototype.reset=function(){this._stack=[]},e.Pipeline.prototype.toJSON=function(){return this._stack.map(function(t){return e.Pipeline.warnIfFunctionNotRegistered(t),t.label})},e.Vector=function(e){this._magnitude=0,this.elements=e||[]},e.Vector.prototype.positionForIndex=function(e){if(0==this.elements.length)return 0;for(var t=0,r=this.elements.length/2,i=r-t,n=Math.floor(i/2),s=this.elements[2*n];i>1&&(s<e&&(t=n),s>e&&(r=n),s!=e);)i=r-t,n=t+Math.floor(i/2),s=this.elements[2*n];return s==e?2*n:s>e?2*n:s<e?2*(n+1):void 0},e.Vector.prototype.insert=function(e,t){this.upsert(e,t,function(){throw"duplicate index"})},e.Vector.prototype.upsert=function(e,t,r){this._magnitude=0;var i=this.positionForIndex(e);this.elements[i]==e?this.elements[i+1]=r(this.elements[i+1],t):this.elements.splice(i,0,e,t)},e.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;for(var e=0,t=this.elements.length,r=1;r<t;r+=2){var i=this.elements[r];e+=i*i}return this._magnitude=Math.sqrt(e)},e.Vector.prototype.dot=function(e){for(var t=0,r=this.elements,i=e.elements,n=r.length,s=i.length,o=0,a=0,u=0,l=0;u<n&&l<s;)o=r[u],a=i[l],o<a?u+=2:o>a?l+=2:o==a&&(t+=r[u+1]*i[l+1],u+=2,l+=2);return t},e.Vector.prototype.similarity=function(e){return this.dot(e)/this.magnitude()||0},e.Vector.prototype.toArray=function(){for(var e=new Array(this.elements.length/2),t=1,r=0;t<this.elements.length;t+=2,r++)e[r]=this.elements[t];return e},e.Vector.prototype.toJSON=function(){return this.elements},e.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},r="[^aeiou]",i="[aeiouy]",n=r+"[^aeiouy]*",s=i+"[aeiou]*",o="^("+n+")?"+s+n,a="^("+n+")?"+s+n+"("+s+")?$",u="^("+n+")?"+s+n+s+n,l="^("+n+")?"+i,c=new RegExp(o),h=new RegExp(u),d=new RegExp(a),f=new RegExp(l),p=/^(.+?)(ss|i)es$/,y=/^(.+?)([^s])s$/,m=/^(.+?)eed$/,v=/^(.+?)(ed|ing)$/,g=/.$/,x=/(at|bl|iz)$/,w=new RegExp("([^aeiouylsz])\\1$"),Q=new RegExp("^"+n+i+"[^aeiouwxy]$"),k=/^(.+?[^aeiou])y$/,S=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,L=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,b=/^(.+?)(s|t)(ion)$/,P=/^(.+?)e$/,T=/ll$/,O=new RegExp("^"+n+i+"[^aeiouwxy]$"),I=function(r){var i,n,s,o,a,u,l;if(r.length<3)return r;if(s=r.substr(0,1),"y"==s&&(r=s.toUpperCase()+r.substr(1)),o=p,a=y,o.test(r)?r=r.replace(o,"$1$2"):a.test(r)&&(r=r.replace(a,"$1$2")),o=m,a=v,o.test(r)){var I=o.exec(r);o=c,o.test(I[1])&&(o=g,r=r.replace(o,""))}else if(a.test(r)){var I=a.exec(r);i=I[1],a=f,a.test(i)&&(r=i,a=x,u=w,l=Q,a.test(r)?r+="e":u.test(r)?(o=g,r=r.replace(o,"")):l.test(r)&&(r+="e"))}if(o=k,o.test(r)){var I=o.exec(r);i=I[1],r=i+"i"}if(o=S,o.test(r)){var I=o.exec(r);i=I[1],n=I[2],o=c,o.test(i)&&(r=i+e[n])}if(o=E,o.test(r)){var I=o.exec(r);i=I[1],n=I[2],o=c,o.test(i)&&(r=i+t[n])}if(o=L,a=b,o.test(r)){var I=o.exec(r);i=I[1],o=h,o.test(i)&&(r=i)}else if(a.test(r)){var I=a.exec(r);i=I[1]+I[2],a=h,a.test(i)&&(r=i)}if(o=P,o.test(r)){var I=o.exec(r);i=I[1],o=h,a=d,u=O,(o.test(i)||a.test(i)&&!u.test(i))&&(r=i)}return o=T,a=h,o.test(r)&&a.test(r)&&(o=g,r=r.replace(o,"")),"y"==s&&(r=s.toLowerCase()+r.substr(1)),r};return function(e){return e.update(I)}}(),e.Pipeline.registerFunction(e.stemmer,"stemmer"),e.generateStopWordFilter=function(e){var t=e.reduce(function(e,t){return e[t]=t,e},{});return function(e){if(e&&t[e.toString()]!==e.toString())return e}},e.stopWordFilter=e.generateStopWordFilter(["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your"]),e.Pipeline.registerFunction(e.stopWordFilter,"stopWordFilter"),e.trimmer=function(e){return e.update(function(e){return e.replace(/^\W+/,"").replace(/\W+$/,"")})},e.Pipeline.registerFunction(e.trimmer,"trimmer"),e.TokenSet=function(){this["final"]=!1,this.edges={},this.id=e.TokenSet._nextId,e.TokenSet._nextId+=1},e.TokenSet._nextId=1,e.TokenSet.fromArray=function(t){for(var r=new e.TokenSet.Builder,i=0,n=t.length;i<n;i++)r.insert(t[i]);return r.finish(),r.root},e.TokenSet.fromClause=function(t){return"editDistance"in t?e.TokenSet.fromFuzzyString(t.term,t.editDistance):e.TokenSet.fromString(t.term)},e.TokenSet.fromFuzzyString=function(t,r){for(var i=new e.TokenSet,n=[{node:i,editsRemaining:r,str:t}];n.length;){var s=n.pop();if(s.str.length>0){var o,a=s.str.charAt(0);a in s.node.edges?o=s.node.edges[a]:(o=new e.TokenSet,s.node.edges[a]=o),1==s.str.length&&(o["final"]=!0),n.push({node:o,editsRemaining:s.editsRemaining,str:s.str.slice(1)})}if(0!=s.editsRemaining){if("*"in s.node.edges)var u=s.node.edges["*"];else{var u=new e.TokenSet;s.node.edges["*"]=u}if(0==s.str.length&&(u["final"]=!0),n.push({node:u,editsRemaining:s.editsRemaining-1,str:s.str}),s.str.length>1&&n.push({node:s.node,editsRemaining:s.editsRemaining-1,str:s.str.slice(1)}),1==s.str.length&&(s.node["final"]=!0),s.str.length>=1){if("*"in s.node.edges)var l=s.node.edges["*"];else{var l=new e.TokenSet;s.node.edges["*"]=l}1==s.str.length&&(l["final"]=!0),n.push({node:l,editsRemaining:s.editsRemaining-1,str:s.str.slice(1)})}if(s.str.length>1){var c,h=s.str.charAt(0),d=s.str.charAt(1);d in s.node.edges?c=s.node.edges[d]:(c=new e.TokenSet,s.node.edges[d]=c),1==s.str.length&&(c["final"]=!0),n.push({node:c,editsRemaining:s.editsRemaining-1,str:h+s.str.slice(2)})}}}return i},e.TokenSet.fromString=function(t){for(var r=new e.TokenSet,i=r,n=0,s=t.length;n<s;n++){var o=t[n],a=n==s-1;if("*"==o)r.edges[o]=r,r["final"]=a;else{var u=new e.TokenSet;u["final"]=a,r.edges[o]=u,r=u}}return i},e.TokenSet.prototype.toArray=function(){for(var e=[],t=[{prefix:"",node:this}];t.length;){var r=t.pop(),i=Object.keys(r.node.edges),n=i.length;r.node["final"]&&(r.prefix.charAt(0),e.push(r.prefix));for(var s=0;s<n;s++){var o=i[s];t.push({prefix:r.prefix.concat(o),node:r.node.edges[o]})}}return e},e.TokenSet.prototype.toString=function(){if(this._str)return this._str;for(var e=this["final"]?"1":"0",t=Object.keys(this.edges).sort(),r=t.length,i=0;i<r;i++){var n=t[i],s=this.edges[n];e=e+n+s.id}return e},e.TokenSet.prototype.intersect=function(t){for(var r=new e.TokenSet,i=void 0,n=[{qNode:t,output:r,node:this}];n.length;){i=n.pop();for(var s=Object.keys(i.qNode.edges),o=s.length,a=Object.keys(i.node.edges),u=a.length,l=0;l<o;l++)for(var c=s[l],h=0;h<u;h++){var d=a[h];if(d==c||"*"==c){var f=i.node.edges[d],p=i.qNode.edges[c],y=f["final"]&&p["final"],m=void 0;d in i.output.edges?(m=i.output.edges[d],m["final"]=m["final"]||y):(m=new e.TokenSet,m["final"]=y,i.output.edges[d]=m),n.push({qNode:p,output:m,node:f})}}}return r},e.TokenSet.Builder=function(){this.previousWord="",this.root=new e.TokenSet,this.uncheckedNodes=[],this.minimizedNodes={}},e.TokenSet.Builder.prototype.insert=function(t){var r,i=0;if(t<this.previousWord)throw new Error("Out of order word insertion");for(var n=0;n<t.length&&n<this.previousWord.length&&t[n]==this.previousWord[n];n++)i++;this.minimize(i),r=0==this.uncheckedNodes.length?this.root:this.uncheckedNodes[this.uncheckedNodes.length-1].child;for(var n=i;n<t.length;n++){var s=new e.TokenSet,o=t[n];r.edges[o]=s,this.uncheckedNodes.push({parent:r,"char":o,child:s}),r=s}r["final"]=!0,this.previousWord=t},e.TokenSet.Builder.prototype.finish=function(){this.minimize(0)},e.TokenSet.Builder.prototype.minimize=function(e){for(var t=this.uncheckedNodes.length-1;t>=e;t--){var r=this.uncheckedNodes[t],i=r.child.toString();i in this.minimizedNodes?r.parent.edges[r["char"]]=this.minimizedNodes[i]:(r.child._str=i,this.minimizedNodes[i]=r.child),this.uncheckedNodes.pop()}},e.Index=function(e){this.invertedIndex=e.invertedIndex,this.fieldVectors=e.fieldVectors,this.tokenSet=e.tokenSet,this.fields=e.fields,this.pipeline=e.pipeline},e.Index.prototype.search=function(t){return this.query(function(r){var i=new e.QueryParser(t,r);i.parse()})},e.Index.prototype.query=function(t){for(var r=new e.Query(this.fields),i=Object.create(null),n=Object.create(null),s=Object.create(null),o=Object.create(null),a=Object.create(null),u=0;u<this.fields.length;u++)n[this.fields[u]]=new e.Vector;t.call(r,r);for(var u=0;u<r.clauses.length;u++){var l=r.clauses[u],c=null,h=e.Set.empty;c=l.usePipeline?this.pipeline.runString(l.term,{fields:l.fields}):[l.term];for(var d=0;d<c.length;d++){var f=c[d];l.term=f;var p=e.TokenSet.fromClause(l),y=this.tokenSet.intersect(p).toArray();if(0===y.length&&l.presence===e.Query.presence.REQUIRED){for(var m=0;m<l.fields.length;m++){var v=l.fields[m];o[v]=e.Set.empty}break}for(var g=0;g<y.length;g++)for(var x=y[g],w=this.invertedIndex[x],Q=w._index,m=0;m<l.fields.length;m++){var v=l.fields[m],k=w[v],S=Object.keys(k),E=x+"/"+v,L=new e.Set(S);if(l.presence==e.Query.presence.REQUIRED&&(h=h.union(L),void 0===o[v]&&(o[v]=e.Set.complete)),l.presence!=e.Query.presence.PROHIBITED){if(n[v].upsert(Q,l.boost,function(e,t){return e+t}),!s[E]){for(var b=0;b<S.length;b++){var P,T=S[b],O=new e.FieldRef(T,v),I=k[T];void 0===(P=i[O])?i[O]=new e.MatchData(x,v,I):P.add(x,v,I)}s[E]=!0}}else void 0===a[v]&&(a[v]=e.Set.empty),a[v]=a[v].union(L)}}if(l.presence===e.Query.presence.REQUIRED)for(var m=0;m<l.fields.length;m++){var v=l.fields[m];o[v]=o[v].intersect(h)}}for(var R=e.Set.complete,F=e.Set.empty,u=0;u<this.fields.length;u++){var v=this.fields[u];o[v]&&(R=R.intersect(o[v])),a[v]&&(F=F.union(a[v]))}var C=Object.keys(i),N=[],_=Object.create(null);if(r.isNegated()){C=Object.keys(this.fieldVectors);for(var u=0;u<C.length;u++){var O=C[u],j=e.FieldRef.fromString(O);i[O]=new e.MatchData}}for(var u=0;u<C.length;u++){var j=e.FieldRef.fromString(C[u]),D=j.docRef;if(R.contains(D)&&!F.contains(D)){var A,B=this.fieldVectors[j],V=n[j.fieldName].similarity(B);if(void 0!==(A=_[D]))A.score+=V,A.matchData.combine(i[j]);else{var z={ref:D,score:V,matchData:i[j]};_[D]=z,N.push(z)}}}return N.sort(function(e,t){return t.score-e.score})},e.Index.prototype.toJSON=function(){var t=Object.keys(this.invertedIndex).sort().map(function(e){return[e,this.invertedIndex[e]]},this),r=Object.keys(this.fieldVectors).map(function(e){return[e,this.fieldVectors[e].toJSON()]},this);return{version:e.version,fields:this.fields,fieldVectors:r,invertedIndex:t,pipeline:this.pipeline.toJSON()}},e.Index.load=function(t){var r={},i={},n=t.fieldVectors,s=Object.create(null),o=t.invertedIndex,a=new e.TokenSet.Builder,u=e.Pipeline.load(t.pipeline);t.version!=e.version&&e.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+e.version+"' does not match serialized index '"+t.version+"'");for(var l=0;l<n.length;l++){var c=n[l],h=c[0],d=c[1];i[h]=new e.Vector(d)}for(var l=0;l<o.length;l++){var c=o[l],f=c[0],p=c[1];a.insert(f),s[f]=p}return a.finish(),r.fields=t.fields,r.fieldVectors=i,r.invertedIndex=s,r.tokenSet=a.root,r.pipeline=u,new e.Index(r)},e.Builder=function(){this._ref="id",this._fields=Object.create(null),this._documents=Object.create(null),this.invertedIndex=Object.create(null),this.fieldTermFrequencies={},this.fieldLengths={},this.tokenizer=e.tokenizer,this.pipeline=new e.Pipeline,this.searchPipeline=new e.Pipeline,this.documentCount=0,this._b=.75,this._k1=1.2,this.termIndex=0,this.metadataWhitelist=[]},e.Builder.prototype.ref=function(e){this._ref=e},e.Builder.prototype.field=function(e,t){if(/\//.test(e))throw new RangeError("Field '"+e+"' contains illegal character '/'");this._fields[e]=t||{}},e.Builder.prototype.b=function(e){e<0?this._b=0:e>1?this._b=1:this._b=e},e.Builder.prototype.k1=function(e){this._k1=e},e.Builder.prototype.add=function(t,r){var i=t[this._ref],n=Object.keys(this._fields);this._documents[i]=r||{},this.documentCount+=1;for(var s=0;s<n.length;s++){var o=n[s],a=this._fields[o].extractor,u=a?a(t):t[o],l=this.tokenizer(u,{fields:[o]}),c=this.pipeline.run(l),h=new e.FieldRef(i,o),d=Object.create(null);this.fieldTermFrequencies[h]=d,this.fieldLengths[h]=0,this.fieldLengths[h]+=c.length;for(var f=0;f<c.length;f++){var p=c[f];if(void 0==d[p]&&(d[p]=0),d[p]+=1,void 0==this.invertedIndex[p]){var y=Object.create(null);y._index=this.termIndex,this.termIndex+=1;for(var m=0;m<n.length;m++)y[n[m]]=Object.create(null);this.invertedIndex[p]=y}void 0==this.invertedIndex[p][o][i]&&(this.invertedIndex[p][o][i]=Object.create(null));for(var v=0;v<this.metadataWhitelist.length;v++){var g=this.metadataWhitelist[v],x=p.metadata[g];void 0==this.invertedIndex[p][o][i][g]&&(this.invertedIndex[p][o][i][g]=[]),this.invertedIndex[p][o][i][g].push(x)}}}},e.Builder.prototype.calculateAverageFieldLengths=function(){for(var t=Object.keys(this.fieldLengths),r=t.length,i={},n={},s=0;s<r;s++){var o=e.FieldRef.fromString(t[s]),a=o.fieldName;n[a]||(n[a]=0),n[a]+=1,i[a]||(i[a]=0),i[a]+=this.fieldLengths[o]}for(var u=Object.keys(this._fields),s=0;s<u.length;s++){var l=u[s];i[l]=i[l]/n[l]}this.averageFieldLength=i},e.Builder.prototype.createFieldVectors=function(){for(var t={},r=Object.keys(this.fieldTermFrequencies),i=r.length,n=Object.create(null),s=0;s<i;s++){for(var o=e.FieldRef.fromString(r[s]),a=o.fieldName,u=this.fieldLengths[o],l=new e.Vector,c=this.fieldTermFrequencies[o],h=Object.keys(c),d=h.length,f=this._fields[a].boost||1,p=this._documents[o.docRef].boost||1,y=0;y<d;y++){var m,v,g,x=h[y],w=c[x],Q=this.invertedIndex[x]._index;void 0===n[x]?(m=e.idf(this.invertedIndex[x],this.documentCount),n[x]=m):m=n[x],v=m*((this._k1+1)*w)/(this._k1*(1-this._b+this._b*(u/this.averageFieldLength[a]))+w),v*=f,v*=p,g=Math.round(1e3*v)/1e3,l.insert(Q,g)}t[o]=l}this.fieldVectors=t},e.Builder.prototype.createTokenSet=function(){this.tokenSet=e.TokenSet.fromArray(Object.keys(this.invertedIndex).sort())},e.Builder.prototype.build=function(){return this.calculateAverageFieldLengths(),this.createFieldVectors(),this.createTokenSet(),new e.Index({invertedIndex:this.invertedIndex,fieldVectors:this.fieldVectors,tokenSet:this.tokenSet,fields:Object.keys(this._fields),pipeline:this.searchPipeline})},e.Builder.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},e.MatchData=function(e,t,r){for(var i=Object.create(null),n=Object.keys(r||{}),s=0;s<n.length;s++){var o=n[s];i[o]=r[o].slice()}this.metadata=Object.create(null),void 0!==e&&(this.metadata[e]=Object.create(null),this.metadata[e][t]=i)},e.MatchData.prototype.combine=function(e){for(var t=Object.keys(e.metadata),r=0;r<t.length;r++){var i=t[r],n=Object.keys(e.metadata[i]);void 0==this.metadata[i]&&(this.metadata[i]=Object.create(null));for(var s=0;s<n.length;s++){var o=n[s],a=Object.keys(e.metadata[i][o]);void 0==this.metadata[i][o]&&(this.metadata[i][o]=Object.create(null));for(var u=0;u<a.length;u++){var l=a[u];void 0==this.metadata[i][o][l]?this.metadata[i][o][l]=e.metadata[i][o][l]:this.metadata[i][o][l]=this.metadata[i][o][l].concat(e.metadata[i][o][l])}}}},e.MatchData.prototype.add=function(e,t,r){if(!(e in this.metadata))return this.metadata[e]=Object.create(null),void(this.metadata[e][t]=r);if(!(t in this.metadata[e]))return void(this.metadata[e][t]=r);for(var i=Object.keys(r),n=0;n<i.length;n++){var s=i[n];s in this.metadata[e][t]?this.metadata[e][t][s]=this.metadata[e][t][s].concat(r[s]):this.metadata[e][t][s]=r[s]}},e.Query=function(e){this.clauses=[],this.allFields=e},e.Query.wildcard=new String("*"),e.Query.wildcard.NONE=0,e.Query.wildcard.LEADING=1,e.Query.wildcard.TRAILING=2,e.Query.presence={OPTIONAL:1,REQUIRED:2,PROHIBITED:3},e.Query.prototype.clause=function(t){return"fields"in t||(t.fields=this.allFields),"boost"in t||(t.boost=1),"usePipeline"in t||(t.usePipeline=!0),"wildcard"in t||(t.wildcard=e.Query.wildcard.NONE),t.wildcard&e.Query.wildcard.LEADING&&t.term.charAt(0)!=e.Query.wildcard&&(t.term="*"+t.term),t.wildcard&e.Query.wildcard.TRAILING&&t.term.slice(-1)!=e.Query.wildcard&&(t.term=""+t.term+"*"),"presence"in t||(t.presence=e.Query.presence.OPTIONAL),this.clauses.push(t),this},e.Query.prototype.isNegated=function(){for(var t=0;t<this.clauses.length;t++)if(this.clauses[t].presence!=e.Query.presence.PROHIBITED)return!1;return!0},e.Query.prototype.term=function(t,r){if(Array.isArray(t))return t.forEach(function(t){this.term(t,e.utils.clone(r))},this),this;var i=r||{};return i.term=t.toString(),this.clause(i),this},e.QueryParseError=function(e,t,r){this.name="QueryParseError",this.message=e,this.start=t,this.end=r},e.QueryParseError.prototype=new Error,e.QueryLexer=function(e){this.lexemes=[],this.str=e,this.length=e.length,this.pos=0,this.start=0,this.escapeCharPositions=[]},e.QueryLexer.prototype.run=function(){for(var t=e.QueryLexer.lexText;t;)t=t(this)},e.QueryLexer.prototype.sliceString=function(){for(var e=[],t=this.start,r=this.pos,i=0;i<this.escapeCharPositions.length;i++)r=this.escapeCharPositions[i],e.push(this.str.slice(t,r)),t=r+1;return e.push(this.str.slice(t,this.pos)),this.escapeCharPositions.length=0,e.join("")},e.QueryLexer.prototype.emit=function(e){this.lexemes.push({type:e,str:this.sliceString(),start:this.start,end:this.pos}),this.start=this.pos},e.QueryLexer.prototype.escapeCharacter=function(){this.escapeCharPositions.push(this.pos-1),this.pos+=1},e.QueryLexer.prototype.next=function(){if(this.pos>=this.length)return e.QueryLexer.EOS;var t=this.str.charAt(this.pos);return this.pos+=1,t},e.QueryLexer.prototype.width=function(){return this.pos-this.start},e.QueryLexer.prototype.ignore=function(){this.start==this.pos&&(this.pos+=1),this.start=this.pos},e.QueryLexer.prototype.backup=function(){this.pos-=1},e.QueryLexer.prototype.acceptDigitRun=function(){var t,r;do t=this.next(),r=t.charCodeAt(0);while(r>47&&r<58);t!=e.QueryLexer.EOS&&this.backup()},e.QueryLexer.prototype.more=function(){return this.pos<this.length},e.QueryLexer.EOS="EOS",e.QueryLexer.FIELD="FIELD",e.QueryLexer.TERM="TERM",e.QueryLexer.EDIT_DISTANCE="EDIT_DISTANCE",e.QueryLexer.BOOST="BOOST",e.QueryLexer.PRESENCE="PRESENCE",e.QueryLexer.lexField=function(t){return t.backup(),t.emit(e.QueryLexer.FIELD),t.ignore(),e.QueryLexer.lexText},e.QueryLexer.lexTerm=function(t){if(t.width()>1&&(t.backup(),t.emit(e.QueryLexer.TERM)),t.ignore(),t.more())return e.QueryLexer.lexText},e.QueryLexer.lexEditDistance=function(t){return t.ignore(),t.acceptDigitRun(),t.emit(e.QueryLexer.EDIT_DISTANCE),e.QueryLexer.lexText},e.QueryLexer.lexBoost=function(t){return t.ignore(),t.acceptDigitRun(),t.emit(e.QueryLexer.BOOST),e.QueryLexer.lexText},e.QueryLexer.lexEOS=function(t){t.width()>0&&t.emit(e.QueryLexer.TERM)},e.QueryLexer.termSeparator=e.tokenizer.separator,e.QueryLexer.lexText=function(t){for(;;){var r=t.next();if(r==e.QueryLexer.EOS)return e.QueryLexer.lexEOS;if(92!=r.charCodeAt(0)){if(":"==r)return e.QueryLexer.lexField;if("~"==r)return t.backup(),t.width()>0&&t.emit(e.QueryLexer.TERM),e.QueryLexer.lexEditDistance;if("^"==r)return t.backup(),t.width()>0&&t.emit(e.QueryLexer.TERM),e.QueryLexer.lexBoost;if("+"==r&&1===t.width())return t.emit(e.QueryLexer.PRESENCE),e.QueryLexer.lexText;if("-"==r&&1===t.width())return t.emit(e.QueryLexer.PRESENCE),e.QueryLexer.lexText;if(r.match(e.QueryLexer.termSeparator))return e.QueryLexer.lexTerm}else t.escapeCharacter()}},e.QueryParser=function(t,r){this.lexer=new e.QueryLexer(t),this.query=r,this.currentClause={},this.lexemeIdx=0},e.QueryParser.prototype.parse=function(){this.lexer.run(),this.lexemes=this.lexer.lexemes;for(var t=e.QueryParser.parseClause;t;)t=t(this);return this.query},e.QueryParser.prototype.peekLexeme=function(){return this.lexemes[this.lexemeIdx]},e.QueryParser.prototype.consumeLexeme=function(){var e=this.peekLexeme();return this.lexemeIdx+=1,e},e.QueryParser.prototype.nextClause=function(){var e=this.currentClause;this.query.clause(e),this.currentClause={}},e.QueryParser.parseClause=function(t){var r=t.peekLexeme();if(void 0!=r)switch(r.type){case e.QueryLexer.PRESENCE:return e.QueryParser.parsePresence;case e.QueryLexer.FIELD:return e.QueryParser.parseField;case e.QueryLexer.TERM:return e.QueryParser.parseTerm;default:var i="expected either a field or a term, found "+r.type;throw r.str.length>=1&&(i+=" with value '"+r.str+"'"),new e.QueryParseError(i,r.start,r.end)}},e.QueryParser.parsePresence=function(t){var r=t.consumeLexeme();if(void 0!=r){switch(r.str){case"-":t.currentClause.presence=e.Query.presence.PROHIBITED;break;case"+":t.currentClause.presence=e.Query.presence.REQUIRED;break;default:var i="unrecognised presence operator'"+r.str+"'";throw new e.QueryParseError(i,r.start,r.end)}var n=t.peekLexeme();if(void 0==n){var i="expecting term or field, found nothing";throw new e.QueryParseError(i,r.start,r.end)}switch(n.type){case e.QueryLexer.FIELD:return e.QueryParser.parseField;case e.QueryLexer.TERM:return e.QueryParser.parseTerm;default:var i="expecting term or field, found '"+n.type+"'";throw new e.QueryParseError(i,n.start,n.end)}}},e.QueryParser.parseField=function(t){var r=t.consumeLexeme();if(void 0!=r){if(t.query.allFields.indexOf(r.str)==-1){var i=t.query.allFields.map(function(e){return"'"+e+"'"}).join(", "),n="unrecognised field '"+r.str+"', possible fields: "+i;throw new e.QueryParseError(n,r.start,r.end)}t.currentClause.fields=[r.str];var s=t.peekLexeme();if(void 0==s){var n="expecting term, found nothing";throw new e.QueryParseError(n,r.start,r.end)}switch(s.type){case e.QueryLexer.TERM:return e.QueryParser.parseTerm;default:var n="expecting term, found '"+s.type+"'";throw new e.QueryParseError(n,s.start,s.end)}}},e.QueryParser.parseTerm=function(t){var r=t.consumeLexeme();if(void 0!=r){t.currentClause.term=r.str.toLowerCase(),r.str.indexOf("*")!=-1&&(t.currentClause.usePipeline=!1);var i=t.peekLexeme();if(void 0==i)return void t.nextClause();switch(i.type){case e.QueryLexer.TERM:return t.nextClause(),e.QueryParser.parseTerm;case e.QueryLexer.FIELD:return t.nextClause(),e.QueryParser.parseField;case e.QueryLexer.EDIT_DISTANCE:return e.QueryParser.parseEditDistance;case e.QueryLexer.BOOST:return e.QueryParser.parseBoost;case e.QueryLexer.PRESENCE:return t.nextClause(),e.QueryParser.parsePresence;default:var n="Unexpected lexeme type '"+i.type+"'";throw new e.QueryParseError(n,i.start,i.end)}}},e.QueryParser.parseEditDistance=function(t){var r=t.consumeLexeme();if(void 0!=r){var i=parseInt(r.str,10);if(isNaN(i)){var n="edit distance must be numeric";throw new e.QueryParseError(n,r.start,r.end)}t.currentClause.editDistance=i;var s=t.peekLexeme();if(void 0==s)return void t.nextClause();switch(s.type){case e.QueryLexer.TERM:return t.nextClause(),e.QueryParser.parseTerm;case e.QueryLexer.FIELD:return t.nextClause(),e.QueryParser.parseField;case e.QueryLexer.EDIT_DISTANCE:return e.QueryParser.parseEditDistance;case e.QueryLexer.BOOST:return e.QueryParser.parseBoost;case e.QueryLexer.PRESENCE:return t.nextClause(),e.QueryParser.parsePresence;default:var n="Unexpected lexeme type '"+s.type+"'";throw new e.QueryParseError(n,s.start,s.end)}}},e.QueryParser.parseBoost=function(t){var r=t.consumeLexeme();if(void 0!=r){var i=parseInt(r.str,10);if(isNaN(i)){var n="boost must be numeric";throw new e.QueryParseError(n,r.start,r.end)}t.currentClause.boost=i;var s=t.peekLexeme();if(void 0==s)return void t.nextClause();switch(s.type){case e.QueryLexer.TERM:return t.nextClause(),e.QueryParser.parseTerm;case e.QueryLexer.FIELD:return t.nextClause(),e.QueryParser.parseField;case e.QueryLexer.EDIT_DISTANCE:return e.QueryParser.parseEditDistance;case e.QueryLexer.BOOST:return e.QueryParser.parseBoost;case e.QueryLexer.PRESENCE:return t.nextClause(),e.QueryParser.parsePresence;default:var n="Unexpected lexeme type '"+s.type+"'";throw new e.QueryParseError(n,s.start,s.end)}}},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.lunr=t()}(this,function(){return e})}();

/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* provides utilities for the included stemmers */
        lunr.stemmerSupport = {
            Among: function(s, substring_i, result, method) {
                this.toCharArray = function(s) {
                    var sLength = s.length, charArr = new Array(sLength);
                    for (var i = 0; i < sLength; i++)
                        charArr[i] = s.charCodeAt(i);
                    return charArr;
                };

                if ((!s && s != "") || (!substring_i && (substring_i != 0)) || !result)
                    throw ("Bad Among initialisation: s:" + s + ", substring_i: "
                        + substring_i + ", result: " + result);
                this.s_size = s.length;
                this.s = this.toCharArray(s);
                this.substring_i = substring_i;
                this.result = result;
                this.method = method;
            },
            SnowballProgram: function() {
                var current;
                return {
                    bra : 0,
                    ket : 0,
                    limit : 0,
                    cursor : 0,
                    limit_backward : 0,
                    setCurrent : function(word) {
                        current = word;
                        this.cursor = 0;
                        this.limit = word.length;
                        this.limit_backward = 0;
                        this.bra = this.cursor;
                        this.ket = this.limit;
                    },
                    getCurrent : function() {
                        var result = current;
                        current = null;
                        return result;
                    },
                    in_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor++;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    in_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor--;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    out_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch > max || ch < min) {
                                this.cursor++;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor++;
                                return true;
                            }
                        }
                        return false;
                    },
                    out_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch > max || ch < min) {
                                this.cursor--;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor--;
                                return true;
                            }
                        }
                        return false;
                    },
                    eq_s : function(s_size, s) {
                        if (this.limit - this.cursor < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor + i) != s.charCodeAt(i))
                                return false;
                        this.cursor += s_size;
                        return true;
                    },
                    eq_s_b : function(s_size, s) {
                        if (this.cursor - this.limit_backward < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor - s_size + i) != s
                                .charCodeAt(i))
                                return false;
                        this.cursor -= s_size;
                        return true;
                    },
                    find_among : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, l = this.limit, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = common; i2 < w.s_size; i2++) {
                                if (c + common == l) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c + common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c + w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c + w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    find_among_b : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, lb = this.limit_backward, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
                                if (c - common == lb) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c - 1 - common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c - w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c - w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    replace_s : function(c_bra, c_ket, s) {
                        var adjustment = s.length - (c_ket - c_bra), left = current
                            .substring(0, c_bra), right = current.substring(c_ket);
                        current = left + s + right;
                        this.limit += adjustment;
                        if (this.cursor >= c_ket)
                            this.cursor += adjustment;
                        else if (this.cursor > c_bra)
                            this.cursor = c_bra;
                        return adjustment;
                    },
                    slice_check : function() {
                        if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit
                            || this.limit > current.length)
                            throw ("faulty slice operation");
                    },
                    slice_from : function(s) {
                        this.slice_check();
                        this.replace_s(this.bra, this.ket, s);
                    },
                    slice_del : function() {
                        this.slice_from("");
                    },
                    insert : function(c_bra, c_ket, s) {
                        var adjustment = this.replace_s(c_bra, c_ket, s);
                        if (c_bra <= this.bra)
                            this.bra += adjustment;
                        if (c_bra <= this.ket)
                            this.ket += adjustment;
                    },
                    slice_to : function() {
                        this.slice_check();
                        return current.substring(this.bra, this.ket);
                    },
                    eq_v_b : function(s) {
                        return this.eq_s_b(s.length, s);
                    }
                };
            }
        };

        lunr.trimmerSupport = {
            generateTrimmer: function(wordCharacters) {
                var startRegex = new RegExp("^[^" + wordCharacters + "]+")
                var endRegex = new RegExp("[^" + wordCharacters + "]+$")

                return function(token) {
                    // for lunr version 2
                    if (typeof token.update === "function") {
                        return token.update(function (s) {
                            return s
                                .replace(startRegex, '')
                                .replace(endRegex, '');
                        })
                    } else { // for lunr version 1
                        return token
                            .replace(startRegex, '')
                            .replace(endRegex, '');
                    }
                };
            }
        }
    }
}));

/*!
 * Lunr languages, `Arabic` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2018, Dalia Al-Shahrabi
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Kazem Taghva, Rania Elkhoury, and Jeffrey Coombs (2005)
 * Meryeme Hadni, Abdelmonaime Lachkar, and S. Alaoui Ouatik (2012)
 *
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.ar = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.ar.trimmer,
        lunr.ar.stopWordFilter,
        lunr.ar.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.ar.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.ar.wordCharacters = "\u0621-\u065b\u0671\u0640";
    lunr.ar.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.ar.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.ar.trimmer, 'trimmer-ar');

    /* lunr stemmer function */
    lunr.ar.stemmer = (function() {
      var self = this;
      var word = '';
      self.result = false;
      self.preRemoved = false;
      self.sufRemoved = false;

      //prefix data
      self.pre = {
        pre1: 'ف ك ب و س ل ن ا ي ت',
        pre2: 'ال لل',
        pre3: 'بال وال فال تال كال ولل',
        pre4: 'فبال كبال وبال وكال'
      };

      //suffix data
      self.suf = {
        suf1: 'ه ك ت ن ا ي',
        suf2: 'نك نه ها وك يا اه ون ين تن تم نا وا ان كم كن ني نن ما هم هن تك ته ات يه',
        suf3: 'تين كهم نيه نهم ونه وها يهم ونا ونك وني وهم تكم تنا تها تني تهم كما كها ناه نكم هنا تان يها',
        suf4: 'كموه ناها ونني ونهم تكما تموه تكاه كماه ناكم ناهم نيها وننا'
      }

      //arabic language patterns and alternative mapping for patterns
      self.patterns = JSON.parse('{"pt43":[{"pt":[{"c":"ا","l":1}]},{"pt":[{"c":"ا,ت,ن,ي","l":0}],"mPt":[{"c":"ف","l":0,"m":1},{"c":"ع","l":1,"m":2},{"c":"ل","l":2,"m":3}]},{"pt":[{"c":"و","l":2}],"mPt":[{"c":"ف","l":0,"m":0},{"c":"ع","l":1,"m":1},{"c":"ل","l":2,"m":3}]},{"pt":[{"c":"ا","l":2}]},{"pt":[{"c":"ي","l":2}],"mPt":[{"c":"ف","l":0,"m":0},{"c":"ع","l":1,"m":1},{"c":"ا","l":2},{"c":"ل","l":3,"m":3}]},{"pt":[{"c":"م","l":0}]}],"pt53":[{"pt":[{"c":"ت","l":0},{"c":"ا","l":2}]},{"pt":[{"c":"ا,ن,ت,ي","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":0},{"c":"ا","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":3},{"c":"ل","l":3,"m":4},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":0},{"c":"ا","l":3}],"mPt":[{"c":"ف","l":0,"m":1},{"c":"ع","l":1,"m":2},{"c":"ل","l":2,"m":4}]},{"pt":[{"c":"ا","l":3},{"c":"ن","l":4}]},{"pt":[{"c":"ت","l":0},{"c":"ي","l":3}]},{"pt":[{"c":"م","l":0},{"c":"و","l":3}]},{"pt":[{"c":"ا","l":1},{"c":"و","l":3}]},{"pt":[{"c":"و","l":1},{"c":"ا","l":2}]},{"pt":[{"c":"م","l":0},{"c":"ا","l":3}]},{"pt":[{"c":"م","l":0},{"c":"ي","l":3}]},{"pt":[{"c":"ا","l":2},{"c":"ن","l":3}]},{"pt":[{"c":"م","l":0},{"c":"ن","l":1}],"mPt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ف","l":2,"m":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"م","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"م","l":0},{"c":"ا","l":2}]},{"pt":[{"c":"م","l":1},{"c":"ا","l":3}]},{"pt":[{"c":"ي,ت,ا,ن","l":0},{"c":"ت","l":1}],"mPt":[{"c":"ف","l":0,"m":2},{"c":"ع","l":1,"m":3},{"c":"ا","l":2},{"c":"ل","l":3,"m":4}]},{"pt":[{"c":"ت,ي,ا,ن","l":0},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ت","l":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":2},{"c":"ي","l":3}]},{"pt":[{"c":"ا,ي,ت,ن","l":0},{"c":"ن","l":1}],"mPt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ف","l":2,"m":2},{"c":"ع","l":3,"m":3},{"c":"ا","l":4},{"c":"ل","l":5,"m":4}]},{"pt":[{"c":"ا","l":3},{"c":"ء","l":4}]}],"pt63":[{"pt":[{"c":"ا","l":0},{"c":"ت","l":2},{"c":"ا","l":4}]},{"pt":[{"c":"ا,ت,ن,ي","l":0},{"c":"س","l":1},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ف","l":3,"m":3},{"c":"ع","l":4,"m":4},{"c":"ا","l":5},{"c":"ل","l":6,"m":5}]},{"pt":[{"c":"ا,ن,ت,ي","l":0},{"c":"و","l":3}]},{"pt":[{"c":"م","l":0},{"c":"س","l":1},{"c":"ت","l":2}],"mPt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ف","l":3,"m":3},{"c":"ع","l":4,"m":4},{"c":"ا","l":5},{"c":"ل","l":6,"m":5}]},{"pt":[{"c":"ي","l":1},{"c":"ي","l":3},{"c":"ا","l":4},{"c":"ء","l":5}]},{"pt":[{"c":"ا","l":0},{"c":"ن","l":1},{"c":"ا","l":4}]}],"pt54":[{"pt":[{"c":"ت","l":0}]},{"pt":[{"c":"ا,ي,ت,ن","l":0}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":2},{"c":"ل","l":3,"m":3},{"c":"ر","l":4,"m":4},{"c":"ا","l":5},{"c":"ر","l":6,"m":4}]},{"pt":[{"c":"م","l":0}],"mPt":[{"c":"ا","l":0},{"c":"ف","l":1,"m":1},{"c":"ع","l":2,"m":2},{"c":"ل","l":3,"m":3},{"c":"ر","l":4,"m":4},{"c":"ا","l":5},{"c":"ر","l":6,"m":4}]},{"pt":[{"c":"ا","l":2}]},{"pt":[{"c":"ا","l":0},{"c":"ن","l":2}]}],"pt64":[{"pt":[{"c":"ا","l":0},{"c":"ا","l":4}]},{"pt":[{"c":"م","l":0},{"c":"ت","l":1}]}],"pt73":[{"pt":[{"c":"ا","l":0},{"c":"س","l":1},{"c":"ت","l":2},{"c":"ا","l":5}]}],"pt75":[{"pt":[{"c":"ا","l":0},{"c":"ا","l":5}]}]}');

      self.execArray = [
        'cleanWord',
        'removeDiacritics',
        'cleanAlef',
        'removeStopWords',
        'normalizeHamzaAndAlef',
        'removeStartWaw',
        'removePre432',
        'removeEndTaa',
        'wordCheck'
      ];

      self.stem = function() {
        var counter = 0;
        self.result = false;
        self.preRemoved = false;
        self.sufRemoved = false;
        while (counter < self.execArray.length && self.result != true) {
          self.result = self[self.execArray[counter]]();
          counter++;
        }
      }

      self.setCurrent = function(word) {
        self.word = word;
      }

      self.getCurrent = function() {
        return self.word
      }

      /*remove elongating character and test that the word does not contain non-arabic characters.
      If the word contains special characters, don't stem. */
      self.cleanWord = function() {
        var wordCharacters = "\u0621-\u065b\u0671\u0640";
        var testRegex = new RegExp("[^" + wordCharacters + "]");
        self.word = self.word
          .replace(new RegExp('\u0640', 'g'), '');
        if (testRegex.test(word)) {
          return true;
        }
        return false;
      }

      self.removeDiacritics = function() {
        var diacriticsRegex = new RegExp("[\u064b-\u065b]");
        self.word = self.word.replace(/[\u064b-\u065b]/gi, '');
        return false;
      }

      /*Replace all variations of alef (آأإٱى) to a plain alef (ا)*/
      self.cleanAlef = function() {
        var alefRegex = new RegExp("[\u0622\u0623\u0625\u0671\u0649]");
        self.word = self.word.replace(alefRegex, "\u0627");
        return false;
      }

      /* if the word is a stop word, don't stem*/
      self.removeStopWords = function() {
        var stopWords = '، اض امين اه اها اي ا اب اجل اجمع اخ اخذ اصبح اضحى اقبل اقل اكثر الا ام اما امامك امامك امسى اما ان انا انت انتم انتما انتن انت انشا انى او اوشك اولئك اولئكم اولاء اولالك اوه اي ايا اين اينما اي ان اي اف اذ اذا اذا اذما اذن الى اليكم اليكما اليكن اليك اليك الا اما ان انما اي اياك اياكم اياكما اياكن ايانا اياه اياها اياهم اياهما اياهن اياي ايه ان ا ابتدا اثر اجل احد اخرى اخلولق اذا اربعة ارتد استحال اطار اعادة اعلنت اف اكثر اكد الالاء الالى الا الاخيرة الان الاول الاولى التى التي الثاني الثانية الذاتي الذى الذي الذين السابق الف اللائي اللاتي اللتان اللتيا اللتين اللذان اللذين اللواتي الماضي المقبل الوقت الى اليوم اما امام امس ان انبرى انقلب انه انها او اول اي ايار ايام ايضا ب بات باسم بان بخ برس بسبب بس بشكل بضع بطان بعد بعض بك بكم بكما بكن بل بلى بما بماذا بمن بن بنا به بها بي بيد بين بس بله بئس تان تانك تبدل تجاه تحول تلقاء تلك تلكم تلكما تم تينك تين ته تي ثلاثة ثم ثم ثمة ثم جعل جلل جميع جير حار حاشا حاليا حاي حتى حرى حسب حم حوالى حول حيث حيثما حين حي حبذا حتى حذار خلا خلال دون دونك ذا ذات ذاك ذانك ذان ذلك ذلكم ذلكما ذلكن ذو ذوا ذواتا ذواتي ذيت ذينك ذين ذه ذي راح رجع رويدك ريث رب زيارة سبحان سرعان سنة سنوات سوف سوى ساء ساءما شبه شخصا شرع شتان صار صباح صفر صه صه ضد ضمن طاق طالما طفق طق ظل عاد عام عاما عامة عدا عدة عدد عدم عسى عشر عشرة علق على عليك عليه عليها عل عن عند عندما عوض عين عدس عما غدا غير  ف فان فلان فو فى في فيم فيما فيه فيها قال قام قبل قد قط قلما قوة كانما كاين كاي كاين كاد كان كانت كذا كذلك كرب كل كلا كلاهما كلتا كلم كليكما كليهما كلما كلا كم كما كي كيت كيف كيفما كان كخ لئن لا لات لاسيما لدن لدى لعمر لقاء لك لكم لكما لكن لكنما لكي لكيلا للامم لم لما لما لن لنا له لها لو لوكالة لولا لوما لي لست لست لستم لستما لستن لست لسن لعل لكن ليت ليس ليسا ليستا ليست ليسوا لسنا ما ماانفك مابرح مادام ماذا مازال مافتئ مايو متى مثل مذ مساء مع معاذ مقابل مكانكم مكانكما مكانكن مكانك مليار مليون مما ممن من منذ منها مه مهما من من نحن نحو نعم نفس نفسه نهاية نخ نعما نعم ها هاؤم هاك هاهنا هب هذا هذه هكذا هل هلم هلا هم هما هن هنا هناك هنالك هو هي هيا هيت هيا هؤلاء هاتان هاتين هاته هاتي هج هذا هذان هذين هذه هذي هيهات و وا واحد واضاف واضافت واكد وان واها واوضح وراءك وفي وقال وقالت وقد وقف وكان وكانت ولا ولم ومن وهو وهي ويكان وي وشكان يكون يمكن يوم ايان'.split(' ');
        if (stopWords.indexOf(self.word) >= 0) {
          return true;
        }
      }

      /* changes ؤ ئ to ء and removes alef if at the end of the word*/
      self.normalizeHamzaAndAlef = function() {
        self.word = self.word.replace('\u0624', '\u0621');
        self.word = self.word.replace('\u0626', '\u0621');
        self.word = self.word.replace(/([\u0627])\1+/gi, '\u0627');
        return false;
      }

      /*remove end taa marboota ة*/
      self.removeEndTaa = function() {
        if (self.word.length > 2) {
          self.word = self.word.replace(/[\u0627]$/, '');
          self.word = self.word.replace('\u0629', '');
          return false;
        } else return true;
      }

      /* if the word starts with double waw وو keep only one of them */
      self.removeStartWaw = function() {
        if (self.word.length > 3 && self.word[0] == '\u0648' && self.word[1] == '\u0648') {
          self.word = self.word.slice(1);
        }
        return false;
      }

      /* remove prefixes of size 4, 3 and 2 characters  */
      self.removePre432 = function() {
        var word = self.word;
        if (self.word.length >= 7) {
          var pre4Regex = new RegExp('^(' + self.pre.pre4.split(' ').join('|') + ')')
          self.word = self.word.replace(pre4Regex, '');
        }
        if (self.word == word && self.word.length >= 6) {
          var pre3Regex = new RegExp('^(' + self.pre.pre3.split(' ').join('|') + ')')
          self.word = self.word.replace(pre3Regex, '');
        }
        if (self.word == word && self.word.length >= 5) {
          var pre2Regex = new RegExp('^(' + self.pre.pre2.split(' ').join('|') + ')')
          self.word = self.word.replace(pre2Regex, '');
        }
        if (word != self.word) self.preRemoved = true;
        return false;
      }

      /* check the word against word patterns. If the word matches a pattern, map it to the 
      alternative pattern if available then stop stemming. */
      self.patternCheck = function(pattern) {
        var patternMatch = false;
        for (var i = 0; i < pattern.length; i++) {
          var currentPatternCheck = true;
          for (var j = 0; j < pattern[i].pt.length; j++) {
            var chars = pattern[i].pt[j].c.split(',');
            var charMatch = false;
            chars.forEach(function(el) {
              if (self.word[pattern[i].pt[j].l] == el) {
                charMatch = true;
              }
            })
            if (!charMatch) {
              currentPatternCheck = false;
              break;
            }
          }
          if (currentPatternCheck == true) {
            if (pattern[i].mPt) {
              var newWord = [];
              for (var k = 0; k < pattern[i].mPt.length; k++) {
                if (pattern[i].mPt[k].m != null) {
                  newWord[pattern[i].mPt[k].l] = self.word[pattern[i].mPt[k].m]
                } else {
                  newWord[pattern[i].mPt[k].l] = pattern[i].mPt[k].c
                }
              }
              self.word = newWord.join('');
            }
            self.result = true;
            break;
          }
        }
      }

      /* remove prefixes of size 1 char*/
      self.removePre1 = function() {
        var word = self.word;
        if (self.preRemoved == false)
          if (self.word.length > 3) {
            var pre1Regex = new RegExp('^(' + self.pre.pre1.split(' ').join('|') + ')')
            self.word = self.word.replace(pre1Regex, '');
          }
        if (word != self.word) self.preRemoved = true;
        return false;
      }

      /*remove suffixes of size 1 char */
      self.removeSuf1 = function() {
        var word = self.word;
        if (self.sufRemoved == false)
          if (self.word.length > 3) {
            var suf1Regex = new RegExp('(' + self.suf.suf1.split(' ').join('|') + ')$')
            self.word = self.word.replace(suf1Regex, '');
          }
        if (word != self.word) self.sufRemoved = true;
        return false;
      }

      /*remove suffixes of size 4, 3 and 2 chars*/
      self.removeSuf432 = function() {
        var word = self.word;
        if (self.word.length >= 6) {
          var suf4Regex = new RegExp('(' + self.suf.suf4.split(' ').join('|') + ')$')
          self.word = self.word.replace(suf4Regex, '');
        }
        if (self.word == word && self.word.length >= 5) {
          var suf3Regex = new RegExp('(' + self.suf.suf3.split(' ').join('|') + ')$')
          self.word = self.word.replace(suf3Regex, '');
        }
        if (self.word == word && self.word.length >= 4) {
          var suf2Regex = new RegExp('(' + self.suf.suf2.split(' ').join('|') + ')$')
          self.word = self.word.replace(suf2Regex, '');
        }
        if (word != self.word) self.sufRemoved = true;
        return false;
      }

      /*check the word length and decide what is the next step accordingly*/
      self.wordCheck = function() {
        var word = self.word;
        var word7Exec = [self.removeSuf432, self.removeSuf1, self.removePre1]
        var counter = 0;
        var patternChecked = false;
        while (self.word.length >= 7 && !self.result && counter < word7Exec.length) {
          if (self.word.length == 7 && !patternChecked) {
            self.checkPattern73();
            patternChecked = true;
          } else {
            word7Exec[counter]();
            counter++;
            patternChecked = false;
          }
        }

        var word6Exec = [self.checkPattern63, self.removeSuf432, self.removeSuf1, self.removePre1, self.checkPattern64];
        counter = 0;
        while (self.word.length == 6 && !self.result && counter < word6Exec.length) {
          word6Exec[counter]();
          counter++;
        }

        var word5Exec = [self.checkPattern53, self.removeSuf432, self.removeSuf1, self.removePre1, self.checkPattern54];
        counter = 0;
        while (self.word.length == 5 && !self.result && counter < word5Exec.length) {
          word5Exec[counter]();
          counter++;
        }

        var word4Exec = [self.checkPattern43, self.removeSuf1, self.removePre1, self.removeSuf432];
        counter = 0;
        while (self.word.length == 4 && !self.result && counter < word4Exec.length) {
          word4Exec[counter]();
          counter++;
        }
        return true;
      }

      self.checkPattern43 = function() {
        self.patternCheck(self.patterns.pt43)
      }
      self.checkPattern53 = function() {
        self.patternCheck(self.patterns.pt53)
      }
      self.checkPattern54 = function() {
        self.patternCheck(self.patterns.pt54)
      }
      self.checkPattern63 = function() {
        self.patternCheck(self.patterns.pt63)
      }
      self.checkPattern64 = function() {
        self.patternCheck(self.patterns.pt64)
      }
      self.checkPattern73 = function() {
        self.patternCheck(self.patterns.pt73)
      }

      /* and return a function that stems a word for the current locale */
      return function(token) {
        // for lunr version 2
        if (typeof token.update === "function") {
          return token.update(function(word) {
            self.setCurrent(word);
            self.stem();
            return self.getCurrent();
          })
        } else { // for lunr version <= 1
          self.setCurrent(token);
          self.stem();
          return self.getCurrent();
        }

      }
    })();

    lunr.Pipeline.registerFunction(lunr.ar.stemmer, 'stemmer-ar');

    lunr.ar.stopWordFilter = lunr.generateStopWordFilter('، اض امين اه اها اي ا اب اجل اجمع اخ اخذ اصبح اضحى اقبل اقل اكثر الا ام اما امامك امامك امسى اما ان انا انت انتم انتما انتن انت انشا انى او اوشك اولئك اولئكم اولاء اولالك اوه اي ايا اين اينما اي ان اي اف اذ اذا اذا اذما اذن الى اليكم اليكما اليكن اليك اليك الا اما ان انما اي اياك اياكم اياكما اياكن ايانا اياه اياها اياهم اياهما اياهن اياي ايه ان ا ابتدا اثر اجل احد اخرى اخلولق اذا اربعة ارتد استحال اطار اعادة اعلنت اف اكثر اكد الالاء الالى الا الاخيرة الان الاول الاولى التى التي الثاني الثانية الذاتي الذى الذي الذين السابق الف اللائي اللاتي اللتان اللتيا اللتين اللذان اللذين اللواتي الماضي المقبل الوقت الى اليوم اما امام امس ان انبرى انقلب انه انها او اول اي ايار ايام ايضا ب بات باسم بان بخ برس بسبب بس بشكل بضع بطان بعد بعض بك بكم بكما بكن بل بلى بما بماذا بمن بن بنا به بها بي بيد بين بس بله بئس تان تانك تبدل تجاه تحول تلقاء تلك تلكم تلكما تم تينك تين ته تي ثلاثة ثم ثم ثمة ثم جعل جلل جميع جير حار حاشا حاليا حاي حتى حرى حسب حم حوالى حول حيث حيثما حين حي حبذا حتى حذار خلا خلال دون دونك ذا ذات ذاك ذانك ذان ذلك ذلكم ذلكما ذلكن ذو ذوا ذواتا ذواتي ذيت ذينك ذين ذه ذي راح رجع رويدك ريث رب زيارة سبحان سرعان سنة سنوات سوف سوى ساء ساءما شبه شخصا شرع شتان صار صباح صفر صه صه ضد ضمن طاق طالما طفق طق ظل عاد عام عاما عامة عدا عدة عدد عدم عسى عشر عشرة علق على عليك عليه عليها عل عن عند عندما عوض عين عدس عما غدا غير  ف فان فلان فو فى في فيم فيما فيه فيها قال قام قبل قد قط قلما قوة كانما كاين كاي كاين كاد كان كانت كذا كذلك كرب كل كلا كلاهما كلتا كلم كليكما كليهما كلما كلا كم كما كي كيت كيف كيفما كان كخ لئن لا لات لاسيما لدن لدى لعمر لقاء لك لكم لكما لكن لكنما لكي لكيلا للامم لم لما لما لن لنا له لها لو لوكالة لولا لوما لي لست لست لستم لستما لستن لست لسن لعل لكن ليت ليس ليسا ليستا ليست ليسوا لسنا ما ماانفك مابرح مادام ماذا مازال مافتئ مايو متى مثل مذ مساء مع معاذ مقابل مكانكم مكانكما مكانكن مكانك مليار مليون مما ممن من منذ منها مه مهما من من نحن نحو نعم نفس نفسه نهاية نخ نعما نعم ها هاؤم هاك هاهنا هب هذا هذه هكذا هل هلم هلا هم هما هن هنا هناك هنالك هو هي هيا هيت هيا هؤلاء هاتان هاتين هاته هاتي هج هذا هذان هذين هذه هذي هيهات وا واحد واضاف واضافت واكد وان واها واوضح وراءك وفي وقال وقالت وقد وقف وكان وكانت ولا ولم ومن وهو وهي ويكان وي وشكان يكون يمكن يوم ايان'.split(' '));

    lunr.Pipeline.registerFunction(lunr.ar.stopWordFilter, 'stopWordFilter-ar');
  };
}))
/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* Set up the pipeline for indexing content in multiple languages. The
           corresponding lunr.{lang} files must be loaded before calling this
           function; English ('en') is built in.

           Returns: a lunr plugin for use in your indexer.

           Known drawback: every word will be stemmed with stemmers for every
           language. This could mean that sometimes words that have the same
           stemming root will not be stemmed as such.
           */
        lunr.multiLanguage = function(/* lang1, lang2, ... */) {
            var languages = Array.prototype.slice.call(arguments);
            var nameSuffix = languages.join('-');
            var wordCharacters = "";
            var pipeline = [];
            var searchPipeline = [];
            for (var i = 0; i < languages.length; ++i) {
                if (languages[i] == 'en') {
                    wordCharacters += '\\w';
                    pipeline.unshift(lunr.stopWordFilter);
                    pipeline.push(lunr.stemmer);
                    searchPipeline.push(lunr.stemmer);
                } else {
                    wordCharacters += lunr[languages[i]].wordCharacters;
                    if (lunr[languages[i]].stopWordFilter) {
                        pipeline.unshift(lunr[languages[i]].stopWordFilter);
                    }
                    if (lunr[languages[i]].stemmer) {
                        pipeline.push(lunr[languages[i]].stemmer);
                        searchPipeline.push(lunr[languages[i]].stemmer);
                    }
                }
            };
            var multiTrimmer = lunr.trimmerSupport.generateTrimmer(wordCharacters);
            lunr.Pipeline.registerFunction(multiTrimmer, 'lunr-multi-trimmer-' + nameSuffix);
            pipeline.unshift(multiTrimmer);

            return function() {
                this.pipeline.reset();

                this.pipeline.add.apply(this.pipeline, pipeline);

                // for lunr version 2
                // this is necessary so that every searched word is also stemmed before
                // in lunr <= 1 this is not needed, as it is done using the normal pipeline
                if (this.searchPipeline) {
                    this.searchPipeline.reset();
                    this.searchPipeline.add.apply(this.searchPipeline, searchPipeline);
                }
            };
        }
    }
}));
