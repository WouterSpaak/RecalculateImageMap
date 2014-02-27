/**
 *  Class RecalculateMap
 *  
 *  Recalculates coordinates of an image map
 *  
 *  @param HTMLElement image
 *      image on which the map is used
 *  @param HTMLElement mapElement
 *      image map
 */
function RecalculateImageMap(image, mapElement) {
    
    this.image               = image;
    
    this.newWidth            = image.width;
    this.newHeight           = image.height;
    
    this.oldWidth            = image.width;
    this.oldHeight           = image.height;
    
    var imageData            = image.dataset;
    
    this.originalWidth       = parseInt(imageData.originalwidth);
    this.originalHeight      = parseInt(imageData.originalheight);
    
    this.element             = mapElement;
    this.areas               = this.element.querySelectorAll('area');
    
    this.originalCoordinates = [];
    
    this.reset               = false;
    
    var _this                = this;
    
    var arrayToString        = function(arr) {
        return arr.join(',');
    }
    
    var getOriginalCoordinates = function() {
        var coords = [];
        
        for(var i = 0; i < _this.areas.length; i++) {
            
            var arr = _this.areas[i].coords.split(',');
            var arrNumbers = [];
            
            for(var j = 0; j < arr.length; j++) {
                arrNumbers.push(parseInt(arr[j]));
            }
            
            coords.push(arrNumbers);
        }
        
        return coords;
    }
    
    var newX = function(num) {
        return Math.floor((_this.newWidth * _this.originalCoordinates[num][0]) / _this.originalWidth);
    }
    
    var newY = function(num) {
        return Math.floor((_this.newHeight * _this.originalCoordinates[num][1]) / _this.originalHeight);
    }
    
    var newR = function(num) {
        return Math.floor(_this.originalCoordinates[num][2] - ((_this.originalHeight - _this.newHeight)/50));
    }
    
    var newValues = function(num) {
        var newArray = [
            newX(num),
            newY(num),
            newR(num)
        ];
        return arrayToString(newArray);
    }
    
    var modifyAreas = function(newValueArray) {
        for(var i = 0; i < _this.areas.length; i++) {
            _this.areas[i].coords = newValueArray[i];
        }
    }
    
    var evaluate = function() {
        _this.newWidth  = _this.image.width;
        _this.newHeight = _this.image.height;
        
        if(_this.newWidth !== _this.oldWidth || _this.newHeight !== _this.oldHeight) {
            _this.oldWidth  = _this.newWidth;
            _this.oldHeight = _this.newHeight;
            return true;
        } else {
            return false;
        }
    }
    
    var recalculate = function() {
        if(evaluate()) {
            var newValueArray = [];
            for(var i = 0; i < _this.areas.length; i++) {
                newValueArray[i] = newValues(i);
            }
            
            modifyAreas(newValueArray);
        }
    }
    
    this.init = function() {
        _this.originalCoordinates = getOriginalCoordinates();
        
        if(_this.reset === false) {
            var newValueArray = [];
            for(var i = 0; i < _this.areas.length; i++) {
                newValueArray[i] = newValues(i);
            }
            modifyAreas(newValueArray);
            
            _this.reset = true;
        }
        
        window.onresize = function() {
            recalculate();
        }
    }    
}
