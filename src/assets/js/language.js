var langs={
	"en":[
		"Subatomo Pond Fan Project",
		"About us",
		"Enter the ponds!",
		"Visit the ponds",
	],
	"es":[
		"Proyecto Estanques Subatomo",
		"Sobre nosotros",
		"Visita los estanques!",
		"Visita los estanques",
	]
	
};
//localStorage["userLang"]="en";
var lng;
if (localStorage.getItem("userLang") === null) {
	lng="en";
}else{
	lng=localStorage["userLang"];
}
