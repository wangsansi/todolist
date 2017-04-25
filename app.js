var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var list = store.fetch("todolist");

var filter = {
				all:function(list){
					return list
				},
				finished:function(list){
					return list.filter(function(item) {
						return item.isChecked;
					});
				},
				unfinished:function(list){
					return list.filter(function(item) {
						return !item.isChecked;
					});
				}
			}

var vm = new Vue({
	el: ".main",
	data: {
		list:list,
		things:"",
		editItem:"",
		beforeTitle:"",
		visibility:"all",
		inputId:"",
	},	
	watch:{
		list:{
			handler:function(){
				store.save("todolist",this.list)
			},
			deep:true
		}
	},
	computed:{
		unCheckedLength(){
			return this.list.filter(function(item){
				return item.isChecked == false
			}).length
		},
		filteredList(){			
			return filter[this.visibility] ? filter[this.visibility](this.list) : list
		}
	},
	methods: {
		addTodo(ev){
			if(this.things !== ""){
				var item = {
					title:this.things,
					isChecked:false,	
				}
				this.list.push(item)
			}				
			this.things = "";
		},
		deleteTodo(item){
			var index = this.list.indexOf(item);
			this.list.splice(index,1);
		},
		editTodo(item){	
			this.beforeTitle = item.title;
			this.editItem = item
		},
		edited(item){
			this.editItem = ""
		},
		cancel(item){
			item.title =  this.beforeTitle;
			this.editItem = "";
			this.beforeTitle = ""
		}
	},
	directives:{
		"focus":{									
			update(el,binding){
				if(binding.value){
					el.focus()
				}

			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
};

watchHashChange();

window.addEventListener("hashchange",watchHashChange)