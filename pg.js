var fn;
var Pg = function(){
    addProp.apply(this,arguments)
}

function addProp(){
    var length = arguments.length;
    if (!length) return;
    for (var i = 0; i < length; i++) {
        var props = arguments[i];
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                if(typeof fn[prop] === 'function'){
                    this[prop] = fn[prop].call(this, props[prop]);
                }
                else{
                    this[prop] = props[prop];
                }
            }
        }
    }
    if(this.init && typeof this.init === 'function'){
        this.init();
    }
};

Pg.prototype.extend = function(){
    if(!arguments.length) return;

    var Parent = this.constructor;
    var pgElement = function () {Parent.apply(this, arguments);};

    pgElement.prototype = Object.create(Parent.prototype);
    addProp.apply(pgElement.prototype, arguments);

    return pgElement.prototype;
}

Pg.prototype.get = function(prop){
    return this[prop];
}
Pg.prototype.set = function(prop, value){
    if(prop in this){
        if(this.get(prop) !== value){
            this[prop] = value;
            if(this.event){
                if(typeof this.event['change:' + prop] === 'function'){
                    this.event['change:' + prop].call(this, value);
                    if(this.eventOne && ('change:' + prop) in this.eventOne){
                        delete this.event['change:' + prop];
                        delete this.eventOne['change:' + prop];
                    }
                }
                if(typeof this.event['change'] === 'function'){
                    this.event['change'].call(this, prop, value);
                    if(this.eventOne && ('change') in this.eventOne){
                        delete this.event['change'];
                        delete this.eventOne['change'];
                    }
                }
            }
        }
    }
}
Pg.prototype.bind = function(event, callback){
    this.event = this.event || {};
    this.event[event] = callback;
}
Pg.prototype.off = function(event){
    if(this.event && event in this.event) delete this.event[event]
    if(this.eventOne && event in this.eventOne) delete this.eventOne[event];
}
Pg.prototype.one = function(event, callback){
    this.event = this.event || {};
    this.eventOne = this.eventOne || {};
    this.event[event] = callback;
    this.eventOne[event] = true;
}
fn = {
    el: function(selector){
        if(selector){
            var type = selector.substr(0,1),
                name = selector.substr(1);
            if(type !== '.' && type !== '#'){
                name = selector.substr(0);
            }

            if(!this.el){
                this.el = document;
            }
            switch (type){
                case '#':
                    return this.el.getElementById(name)[0];
                case '.':
                    return this.el.getElementsByClassName(name)[0];
                default:
                    return this.el.getElementsByTagName(name)[0];
            }
        }
        return undefined;
    }
}

pg = new Pg();