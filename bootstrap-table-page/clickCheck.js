define(["backbone", './state', 'bootstrap.table.extension'], function(Backbone, state, Table) {
	return Table.extend({
		initialize : function(options) {
			this.options = options.options;
			this.tableNum=options.tableNum;
			this.selections=[];//**����ѡ����������
			this.selectionIds=[];//**����ѡ������id������
			Table.prototype.initialize.call(this, this.options);
		},
		events : {
		},
		render : function() {
			var _this = this;
			// ����table�ڵ�
			this.$table = $("<table>");
			this.$el.html(this.$table);
			//**
			function responseHandler(res) {
			    	$.each(res.rows, function (i, row) {  
			    	      //�жϵ�ǰ�е�����id�Ƿ������ѡ�е����飬�����򽫶�ѡ��״̬��Ϊtrue  
			              row.checkStatus = $.inArray(row.id, this.selectionIds) != -1;  
			          });  
			          return res;  
			};
			// ��ʼ�����
			this.$table.bootstrapTable({
				locale : 'zh-CN',
				pagination : true,
				// Ĭ�ϱ�����������ֶ�
				sortName : "",
				sortOrder : "",
				idField:"id",//��־ѡ���id
				pageNumber : _this.tableNum,//**���ǵڼ�ҳ
				pageSize : 10,
				pageList: [10, 50, 100],
				sidePagination : 'server',
				maintainSelected:true,
				ajax : $request,
				url :  xxx,
				queryParams : function(params) {
					//params["columns"] = "name,buyPerson,tel,price,createTime,state";
					// �Ƿ��и��Ӳ���
					if ($.isFunction(_this.getQueryParams)) {
						params = $.extend(params, _this.getQueryParams());
					}
					return params;
				},
				clickToSelect : true,
				responseHandler : responseHandler,
				columns : [{
				    field: 'checkStatus',checkbox: true, 
				},{field: 'id',visible:false}, 
				{
					title : '���',
					formatter : function(value, row, index) {
						return index + 1;
					}
				}, {
					field : 'name',
					title : '��������',
					sortable : true,
					formatter : function(value, row) {
						var html = "";
						if (row.topTime) {
							html += '<span style="font-size:smaller;color:#d9534f;">[�ö�]</span> ';
						}
						return html+value;
					}
				}]
			});
			//**ͨ��ȫ��ѡ�����ݽ���Ԫ�ػ�ȡ
			this.showCheck();
		    //**��ȡ��ȫ��ѡ�е�����
			this.clickget()
			return this;
		},
		refresh : function(params) {
			this.$table.bootstrapTable("refresh", {
				query : params
			});
		},
		   clickget:function(){
		       var mark;
		       var _this=this;
		       var union = function(array,ids){  
			     $.each(ids, function (i, id) {  
			            if($.inArray(id,array)==-1){  
			                array[array.length] = id;  
			            }  
			     });  
			     return array;  
		       };
		       //ȡ��ѡ���¼���������  
		       var difference = function(array,ids){  
			   $.each(ids, function (i, id) {  
			                 var index = $.inArray(id,array);  
			                 mark=index;
			                 if(index!=-1){  
			                     array.splice(index, 1);  
			                 }  
			             });  
			    return array;  
		       };
		       var unions = function(arrays,rowa){  
			     $.each(rowa, function (i, row) {  
			            if($.inArray(row,arrays)==-1){  
			                arrays[arrays.length] = row;  
			            }  
			     });  
			     return arrays;  
		       };
		       var differences = function(arrays,rowa){  
			   $.each(rowa, function (i, row) {  
			                 
			                 if(mark!=-1){  
			                     arrays.splice(mark, 1);  
			                 }  
			             });
			 
			    return arrays;  
		       };
		       //��ѡ���¼���ȡ���¼���ȫ��ѡ�С�ȫ��ȡ��  
		       this.$table.on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table', function (e, rows) {
			   	var _ = {"union":union,"difference":difference}; 
			   	var aa= {"unions":unions,"differences":differences};
		                var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {  
		                        return row.id;  
		                }); 
		                var rowa= $.map(!$.isArray(rows) ? [rows] : rows, function (row) {  
		                        return row
		                }); 
		                func = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'union' : 'difference';
		                funcs = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'unions' : 'differences';
		                _this.selectionIds = _[func](_this.selectionIds, ids);  
		                _this.selection = aa[funcs](_this.selections, rowa);  
		        })  
		   },
		   showCheck:function(){//����ҳ�����ʱ����ʾ֮ǰ��ѡ��
			    var _this=this;
			    this.$(".bootstrap-table").on('post-body.bs.table', function () {
				for(var i=0;i<_this.selectionIds.length;i++){
				    _this.$("input[value="+_this.selectionIds[i]+"]").attr("checked",true);
				}
			    });
			},
		// ��ȡѡ�е���
		getSelections : function() {
			return this.$table.bootstrapTable("getSelections");
		},
	
		
	});
});
