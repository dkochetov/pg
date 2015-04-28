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
    pgElement.prototype.constructor = pgElement;
    addProp.apply(pgElement.prototype, arguments);
    return pgElement.prototype;
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