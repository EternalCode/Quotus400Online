
/* Math Macro functions */
function rand_range(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function rand() {
	return Math.random()
}

function offset(x, y) {
	return (Math.max(x, y) - Math.min(x, y));
}

function constrain(x, xmin, xmax) {
	if (x < xmin) {
		return xmin;
	} else if (x > xmax) {
		return xmax;
	} else {
		return x;
	}
}

/* Radians and degrees conversions */
function radians(degrees) {
	return ((degrees * Math.PI) / 180);
}

function degrees(radians) {
	return ((radians * 180) / Math.PI)	;
}

// vector object
function Vector(x, y) {

	/* Angle was passed in, create a unit vector */
	if (y == null) {
		this.x = Math.cos(radians(x));
		this.y = Math.sin(radians(x));
	} else {
		this.x = x;
		this.y = y;
	}
	this.set = function(new_x, new_y) {
		this.x = new_x;
		this.y = new_y;
	};

	this.apply = function(dx, dy) {
		this.x += dx;
		this.y += dy;
	};

	this.subtractv = function(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	this.multiply = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}

	this.is_equals = function(v) {
		return ((this.x == v.x) && (this.y == v.y));
	}

	// radians rotation
	this.rotate = function(angle) {
		angle = radians(angle);
		var xprime = ((this.x * Math.cos(angle)) - (this.y * Math.sin(angle)));
		var yprime = ((this.x * Math.sin(angle)) + (this.y * Math.cos(angle)));
		this.x = xprime;
		this.y = yprime;
	}

	this.get_angle = function() {
		return degrees(Math.atan2(this.y, this.x));
	}

	/* Note that vectors on the 3D plane calculate perpindicularity using the cross product
	 * Currently, this only supports 2 dimensional vectors */
	this.perpendicular_ccw = function () {
		return new Vector(-(this.y), this.x);
	}

	this.perpendicular_cw = function () {
		return new Vector(this.y, -(this.x));
	}

	this.magnitude = function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

}

function log_base(x, base) {
	return (constraint(Math.log(x), Math.log(x), 1)) / Math.log(base);
}

function multiple(val, x) {
	return Math.round(val / x ) * x;
}

/* Pythagorean theorem to calculate circle distance */
function dist(x1, y1, x2, y2) {
	var a_squared = Math.pow(offset(x1, x2), 2);
	var b_squared = Math.pow(offset(y1, y2), 2);
	return Math.floor(Math.sqrt(a_squared + b_squared));
}


/* On load event handler */
function appendEvent(func_event) {
	var current_func = window.onload;
	if (typeof current_func != 'function') {
		window.onload = func_event;
	} else {
		window.onload = function() {
			current_func();
			func_event();
		}
	}
}

/* */
function get_text_width(txt, fontname, fontsize){
  var c = document.createElement('canvas');
  var ctx = c.getContext('2d');
  ctx.font = fontsize + 'px' + fontname;
  var length = ctx.measureText(txt).width;
  return length;
}

/* Source: http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes */
function get_scrollbar_width() {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
};

function srgb(r, g, b, a, t) {
	if (t == null) {
		return ("rgb(" + r + ", " + g + ", " + b + (a ? (", " + a) : "") + ")");
	} else {
		return ("#" + to_hex(r) + to_hex(g) + to_hex(b));
	}
}

function to_hex(dec_num) {
	return dec_num.toString(16);
}

function to_dex(hex_num) {
	return parseInt(hex_num, 16);
}

function ekey_down(event) {
	keys[event.keyCode] = true;
}

function ekey_up(event) {
	delete keys[event.keyCode];
}

function emouse_down(event) {
	//console.log("down");
	button_mousedown = true;
}

function emouse_up(event) {
	//console.log("released");
	button_mousedown = false;
}

function emouse_move(event) {
	mouse_x = event.clientX;
	mouse_y = event.clientY;
	//console.log(mouse_x, mouse_y)
}

var mouse_x = 0;
var mouse_y = 0;
var button_mousedown = false;
var keys = [];
var backspace = 8;
var key_tab = 9;
var key_enter = 13;
var key_shift = 16;
var key_ctrl = 17;
var key_alt = 18;
var key_pause = 19;
var key_capslock = 20;
var key_escape = 27;
var key_space = 32;
var key_left_arrow = 37;
var key_up_arrow = 38;
var key_right_arrow = 39;
var key_down_arrow = 40;
var key_delete = 46;
var key_0 = 48;
var key_1 = 49;
var key_2 = 50;
var key_3 = 51;
var key_4 = 52;
var key_5 = 53;
var key_6 = 54;
var key_7 = 55;
var key_8 = 56;
var key_9 = 57;
var key_a = 65;
var key_b = 66;
var key_c = 67;
var key_d = 68;
var key_e = 69;
var key_f = 70;
var key_g = 71;
var key_h = 72;
var key_i = 73;
var key_j = 74;
var key_k = 75;
var key_l = 76;
var key_m = 77;
var key_n = 78;
var key_o = 79;
var key_p = 80;
var key_q = 81;
var key_r = 82;
var key_s = 83;
var key_t = 84;
var key_u = 85;
var key_v = 86;
var key_w = 87;
var key_x = 88;
var key_y = 89;
var key_z = 90;
