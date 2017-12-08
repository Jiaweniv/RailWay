/**
 * 辖区监督机构
 * 
 * */
(function() {
	'use strict';
	Mydao.currentPage.params.orgid_jdzx = -2;
	Mydao.currentPage.params.orgid_jdzxs;
	Mydao.dialogid_jdzx;
	var resizeInput = function(parent) {
		$(parent).find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 35);
		});
		$(parent).find(".group-select").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 40);
		});
		$(parent).find(".group-textarea").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 30);
		});
		$(parent).find('.sidebar-collapse').slimScroll({
			height: '100%',
		});
	};
	//事件集
	var getSelectedTreeNode = function(ztree) {
			var treeObj = $.fn.zTree.getZTreeObj(ztree);
			if(treeObj.getSelectedNodes() && treeObj.getSelectedNodes().length > 0) {
				return treeObj.getSelectedNodes()[0];
			}
			return null;
		},
		getSelectedAllName = function(node, names) {
			names.unshift(node.name);
			var _p = node.getParentNode();
			if(_p) {
				getSelectedAllName(_p, names);
			}
		};

	//查询所有的子节点
	function getChildren(arrays, treeNode) {
		arrays.push(treeNode.id);
		if(treeNode.children) {
			for(var i = 0; i < treeNode.children.length; i++) {
				var node = treeNode.children[i];
				arrays.push(node.id);
				if(node.isParent) {
					getChildren(arrays, node);
				}
			}
		}
	}

	//获取监督中心菜单
	var setting = {
		view: {
			showLine: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: function(event, treeId, treeNode) {
				Mydao.currentPage.params.name = null;
				$("#xiaqujiandujigou input[name='search_name']").val("");
				var orgid_jdzxs = [];
				getChildren(orgid_jdzxs, treeNode);
				Mydao.currentPage.params.orgid_jdzxs = orgid_jdzxs;
				Mydao.currentPage.params.orgid_jdzx = treeNode.id;
				$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
					pageNumber: 1
				}).bootstrapTable("refresh");
			}
		}
	};
	var zNodes = [];
	Mydao.ajax({
		"type": 2,
		"orgtype": 1
	}, 'organization/finddepjdzx', function(result) {
		if(result.code == 200) {
			var data = result.result;
			if(data) {
				$.each(data, function(index, val) {
					if(index == 0) {
						Mydao.currentPage.params.orgid_jdzx = val.id;
					}
					zNodes.push({
						id: val.id,
						name: val.name,
						pId: val.parentid
					});
				});
			}
			var treeObj = $.fn.zTree.init($("#xiaqujiandujigou #xiaqujiandujigou_tree"), setting, zNodes);
			var treeNode = treeObj.getNodes()[0];
			var orgid_jdzxs = [];
			treeObj.selectNode(treeNode);
			orgid_jdzxs.push(treeNode.id);
			if(treeNode.children) {
				for(var i = 0; i < treeNode.children.length; i++) {
					var node = treeNode.children[i];
					orgid_jdzxs.push(node.id);
				}
			}
			Mydao.currentPage.params.orgid_jdzxs = orgid_jdzxs;
			personList();
		} else {
			layer.alert(result.msg);
		}

	});

	/**
	 * 添加
	 */
	$("#xiaqujiandujigou_lzh").find('#xiaqujiandujigou_menu_add').on('click', function() {
		$('#bumennameOut').show();
		$('#bumenjcOut').hide();
		var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
		var _selectNodes = treeObj.getSelectedNodes();
		var _selectNodesID;
		if(_selectNodes.length == 1) {
			_selectNodesID = _selectNodes[0].id;
		} else {
			layer.msg('请选择要添加部门的机构');
		}
		var dialog = layer.open({
			type: 1,
			content: $("#PersonnelLayer").html(),
			area: ["420px", "350px"],
			title: '辖区监督机构',
			btn: ['保存', '返回'],
			btnAlign: 'c',
			success: function(layero, index) {
				layero.find("input").val("");
				resizeInput(layero);
			},
			cancel: function(layero, index) {},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				Mydao.ajax({
					"name": layero.find('form [name="name"]').val(),
					"departmentexplain": layero.find('form [name="departmentexplain"]').val(),
					"parentid": _selectNodesID,
					"type": 2,
					"orgtype": 1
				}, 'organization/addDepartment', function(result) {
					var currentTime = result.serverTime;
					if(result.code == 200) {
						var zNodes = [];
						Mydao.ajax({
							"id": Mydao.centerorgid,
							"type": 2,
							"orgtype": 1
						}, 'organization/finddepjdzx', function(result) {
							if(result.code == 200) {
								var data = result.result;
								if(data) {
									$.each(data, function(index, val) {
										zNodes.push({
											id: val.id,
											name: val.name,
											parentid: val.parentid,
											pId: val.parentid
										});
									});
								}

								$.fn.zTree.destroy("xiaqujiandujigou_tree");
								$.fn.zTree.init($("#xiaqujiandujigou #xiaqujiandujigou_tree"), setting, zNodes);
							} else {
								layer.alert(result.msg);
							}

						});
					} else {
						layer.msg(result.msg);
					}
				});
				layer.close(index);
			},
			btn2: function(index, layero) {}
		});
	});

	//查询
	$("#xiaqujiandujigou_lzh").find("#xiaqujiandujigou button[name='search']").on('click', function() {
		var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
		var _selectNodes = treeObj.getSelectedNodes(),
			treeNode = {};
		if(_selectNodes.length > 0) {
			treeNode = _selectNodes[0];
			var orgid_jdzxs = [];
			orgid_jdzxs.push(treeNode.id);
			if(treeNode.children) {
				for(var i = 0; i < treeNode.children.length; i++) {
					var node = treeNode.children[i];
					orgid_jdzxs.push(node.id);
				}
			}
			Mydao.currentPage.params.orgid_jdzxs = orgid_jdzxs;
			Mydao.currentPage.params.orgid_jdzx = treeNode.id;
		}
		Mydao.currentPage.params.name = $("#xiaqujiandujigou input[name='search_name']").val();
		$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
			pageNumber: 1
		}).bootstrapTable("refresh");
	});

	/**
	 * 编辑
	 */
	$("#xiaqujiandujigou_lzh").find('#xiaqujiandujigou_menu_edit').on('click', function() {
		$('#bumennameOut').show();
		$('#bumenjcOut').hide();
		var treeObj = getSelectedTreeNode("xiaqujiandujigou_tree");
		if(!treeObj) {
			layer.msg('请选择修改项');
			return false;
		}
		if(treeObj.level == 0) {
			layer.msg('不能编辑该机构');
			return false;
		}
		var dialog = layer.open({
			type: 1,
			content: $("#PersonnelLayer").html(),
			area: ["420px", "350px"],
			btn: ['保存', '取消'],
			success: function(layero, index) {
				Mydao.ajax({
					"orgid": treeObj.id
				}, "organization/getdepdetail", function(data) {
					if(data.code == 200) {
						var result = data.result;
						layero.find('#bumename').val(result.name);
						layero.find('#departmentexplain').val(result.departmentexplain);
					}
				});
				Mydao.currentPage.dialog.index = index;
				//					Mydao.setform(layero.find("form"), treeObj);
				resizeInput(layero);
			},
			cancel: function(layero, index) {},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				Mydao.ajax({
					"id": treeObj.id,
					"name": layero.find('form [name="name"]').val(),
					"departmentexplain": layero.find('form [name="departmentexplain"]').val(),
					"parentid": treeObj.parentid,
				}, 'organization/editDepartment', function(data) {
					var currentTime = data.serverTime;
					if(data.code == 200) {
						var result = data.result;
						treeObj.name = layero.find('form [name="name"]').val();
						treeObj.departmentexplain = layero.find('form [name="departmentexplain"]').val();
						$.fn.zTree.getZTreeObj('xiaqujiandujigou_tree').updateNode(treeObj);
					} else {
						layer.msg(data.msg);
					}
				});
				layer.close(index);
			}
		});
	});
	/**
	 * 删除
	 */
	$("#xiaqujiandujigou_lzh").find('#xiaqujiandujigou_menu_del').on('click', function() {
		var treeObj = getSelectedTreeNode('xiaqujiandujigou_tree');
		if(!treeObj) {
			layer.msg('请选择删除项');
			return false;
		}
		if(treeObj.level == 0) {
			layer.msg('不能删除该机构');
			return false;
		}
		layer.confirm('确定删除？', function(index) {
			$(this).doajax({
				url: 'organization/deleteDepartment',
				data: {
					id: treeObj.id
				}
			}, function() {
				$.fn.zTree.getZTreeObj('xiaqujiandujigou_tree').removeNode(treeObj);
			});
			layer.close(index);
		});
	});

	///////////////////////////人员信息////////////////////////
	//		新建人员
	$("#xiaqujiandujigou_lzh").find('#personnel_btn_xqjdjg').on('click', function() {
		var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
		var _selectNodes = treeObj.getSelectedNodes();
		if(_selectNodes.length == 1) {
			if(_selectNodes[0].parentid == -1) {
				layer.msg("该节点不能添加人员");
				return false;
			}
		} else {
			layer.msg("请选择要添加人员的检测机构或部门");
			return false;
		}
		layer.open({
			type: 1,
			title: '新建人员',
			content: '',
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/PersonneChilds/departmentlayer.html", function() {
					$('#lawlicenseOut').show();
					$('#law').show();
					$('#checkflagPersonW').show();
					layero.find("input,select").val("");
					init_showstep();
					resizeInput(layero);
					//初始化下拉框
					Mydao.initselect(layero);
					//所属部门
					var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
					var _selectNodes = treeObj.getSelectedNodes(); //获取当前选中的组织机构		
					$("#personorganizationid").append("<option value=''>--请选择--</option>");
					if(_selectNodes && _selectNodes.length == 1) {
						var selectOrgId = _selectNodes[0].id;
						Mydao.ajax({
							'orgid': selectOrgId,
						}, 'organization/finddepgroup', function(result) {
							var currentTime = result.serverTime;
							if(result.code == 200) {
								$.each(result.result, function(a, b) {
									$("#personorganizationid").append("<option value='" + b.id + "'>" + b.name + "</option>");
								});
							} else {
								layer.msg(result.msg);
							}
						});
					}
					//资格证书列表
					person_aptitude_list();
					//资格证书添加
					person_aptitude_add();

					Mydao.dialogid_jdzx = index;

					checkPerson();

					$("select[name='checkflag']").trigger("change");
				});
			},
			cancel: function(index, layero) {
				layero.find("input,select").val("");
			}
		});
	});
	var init_showstep = function() {
		$("#example-embed").steps({
			transitionEffect: "fade",
			onInit: function(event, currentIndex) {

			},
			onStepChanging: function(event, currentIndex, newIndex) {
				$("#DepartmentLayer #DepartmentForm").trigger("validate");
				if(!$("#DepartmentLayer #DepartmentForm").data("validator").isFormValid()) {
					return false;
				}
				return true;

				//					if(!$("#DepartmentLayer #DepartmentForm").data("validator").isFormValid()) return false;
				//					//检查人员，专业不能为空
				//					var checkflag = $("#DepartmentLayer #DepartmentForm #checkflag option:selected").val();
				//					if(checkflag == 1) {
				//						var profession = $("#DepartmentLayer #DepartmentForm #profession option:selected").val();
				//						if(!profession) {
				//							$('#DepartmentLayer #DepartmentForm').validator('showMsg', '#profession', {
				//								type: "error",
				//								msg: "为检查人员，此处不能为空"
				//							});
				//							return false;
				//						}
				//						var lawlicense = $("#DepartmentLayer #DepartmentForm #lawlicense").val();
				//						if(!lawlicense) {
				//							$('#DepartmentLayer #DepartmentForm').validator('showMsg', '#lawlicense', {
				//								type: "error",
				//								msg: "为检查人员，此处不能为空"
				//							});
				//							return false;
				//						}
				//					}
				//					return true;
			},
			onStepChanged: function(event, currentIndex, priorIndex) {
				//人员显示
				if(Mydao.showPerson) {
					return;
				}
				var paramsPerson = $("#DepartmentLayer #DepartmentForm").serializeJson();
				var today0 = Mydao.formatDate(new Date());
				if(currentIndex == 1 && paramsPerson.birthday > today0) {
					layer.alert("出生日期填写不正确！");
					return false;
				}
				if(paramsPerson.id && currentIndex > priorIndex) {
					var url = 'person/edit';
					Mydao.ajax(paramsPerson, url, function(result) {
						if(result.code == 200) {
							//layer.alert("操作成功！");
						} else {
							layer.alert(result.msg + "，记录没有保存成功");
						}
					});
				}
			},
			onFinished: function(event, currentIndex) {
				//人员显示
				if(Mydao.showPerson) {
					layer.close(Mydao.dialogid_jdzx);
					Mydao.showPerson = false;
					return;
				}
				if(!Mydao.currentPage.params.orgid_jdzx) {
					layer.alert("请选择一个机构或部门！");
					return;
				}
				var paramsPerson = $("#DepartmentLayer #DepartmentForm").serializeJson();
				if(!paramsPerson.organizationid) {
					paramsPerson.organizationid = Mydao.currentPage.params.orgid_jdzx;
				}
				var paramsAptitude = $('#DepartmentLayer #Qualificationtable').bootstrapTable("getData");
				var params = {};
				params.paramsPerson = paramsPerson;
				params.paramsAptitude = paramsAptitude;
				if(!paramsPerson.id) {
					var url = 'person/add';
					Mydao.ajax(params, url, function(result) {
						if(result.code == 200) {
							layer.alert("操作成功！");
							layer.close(Mydao.dialogid_jdzx);
							$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				} else {
					var url3 = 'personAptitude/edit';
					params.personid = $("input[name='id']").val();
					params.paramsAptitude = paramsAptitude;
					Mydao.ajax(params, url3, function(result) {
						if(result.code == 200) {
							layer.alert("操作成功！");
							layer.close(Mydao.dialogid_jdzx);
							$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
								pageNumber: 1
							}).bootstrapTable("refresh");
						} else {
							layer.alert(result.msg);
						}
					});
				}

			}
		});
	};

	//		$("body").undelegate("change");
	//		$("body").delegate("#DepartmentLayer #DepartmentForm #profession", "change", function() {
	//			if($(this).val()) {
	//				$('#DepartmentLayer #DepartmentForm').validator('hideMsg', '#profession');
	//			}
	//		});
	//		$("body").delegate("#DepartmentLayer #DepartmentForm #lawlicense", "change", function() {
	//			if($(this).val()) {
	//				$('#DepartmentLayer #DepartmentForm').validator('hideMsg', '#lawlicense');
	//			}
	//		});
	//		$("body").delegate("#DepartmentLayer #DepartmentForm #checkflag", "change", function() {
	//			if($(this).val() == 0) {
	//				$('#DepartmentLayer #DepartmentForm').validator('hideMsg', '#profession');
	//				$('#DepartmentLayer #DepartmentForm').validator('hideMsg', '#lawlicense');
	//			}
	//		});
	//		编辑
	var center_edit = function(e, value, row, index) {
		Mydao.ajax({
			'id': row.id,
		}, 'person/show', function(data) {
			var currentTime = data.serverTime;
			if(data.code == 200) {
				var result = data.result;
				layer.open({
					type: 1,
					title: '编辑人员',
					content: '',
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/PersonneChilds/departmentlayer.html", function() {
							$('#lawlicenseOut').show();
							$('#law').show();
							$('#checkflagPersonW').show();
							init_showstep();
							resizeInput(layero);
							Mydao.initselect(layero, null, function() {
								Mydao.setform($('#DepartmentForm'), result);
							}); //加载select
							//所属部门
							var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
							var _selectNodes = treeObj.getSelectedNodes(); //获取当前选中的组织机构		
							$("#personorganizationid").append("<option value=''>--请选择--</option>");
							if(_selectNodes && _selectNodes.length == 1) {
								var selectOrgId = _selectNodes[0].id;
								Mydao.ajax({
									'orgid': selectOrgId,
								}, 'organization/finddepgroup', function(result) {
									var currentTime = result.serverTime;
									if(result.code == 200) {
										$.each(result.result, function(a, b) {
											$("#personorganizationid").append("<option value='" + b.id + "'>" + b.name + "</option>");
										});
									} else {
										layer.alert(result.msg);
									}
								});
							}
							//资格证书列表
							person_aptitude_list(row);
							//资格证书添加
							person_aptitude_add();

							Mydao.dialogid_jdzx = index;

							checkPerson();

							$("select[name='checkflag']").trigger("change");

						});
					},
					cancel: function(layero, index) {
						index.find("input,select").val("");
					}
				});
			} else {
				layer.msg(data.msg);
			}
		});
	};

	//		编辑
	var person_aptitude_edit = function(e, value, row, indexr) {
		layer.open({
			type: 1,
			title: '编辑资格证书',
			content: '',
			btn: ['确认', '取消'],
			btnAlign: 'c',
			//					area: ["440px", "400px"],
			area: ["70%", "90%"],
			moveOut: true,
			success: function(layero, index) {
				layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/PersonneChilds/personAptitude.html", function() {
					resizeInput(layero);
					Mydao.initselect(layero, null, function() {
						Mydao.setform(layero.find('form'), row);
					}); //加载select
				});
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				var setform = layero.find("#certificateLayer_form").serializeJson();
				var statusName = layero.find("select[name='status'] option[value='" + setform.status + "']").text();
				var specialty = $("#DepartmentLayer select[name='profession']").val();
				setform.expiry = Date.parse(setform.expiry);
				setform.statusName = statusName;
				setform.flag = 0;
				$('#DepartmentLayer #Qualificationtable').bootstrapTable('updateRow', {
					index: indexr,
					row: setform
				});
				layer.close(index);
			}
		});
	};
	//		删除
	var person_aptitude_del = function(e, value, row, indexr) {
		var rows = $('#DepartmentLayer #Qualificationtable').bootstrapTable("getData");
		rows.splice(indexr, 1);
		$("#DepartmentLayer #Qualificationtable").bootstrapTable("load", rows);
	};

	var showPerson = function(e, value, row, index) {
		Mydao.ajax({
			'id': row.id,
		}, 'person/show', function(result) {
			var currentTime = result.serverTime;
			if(result.code == 200) {
				//					var result = result.result;
				var d = result.result;
				layer.open({
					type: 1,
					title: '查看人员',
					content: '',
					area: ["70%", "90%"],
					moveOut: true,
					success: function(layero, index) {
						layui.use(['laytpl'], function() {
							var laytpl = layui.laytpl;
							layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/PersonneChilds/PersonSee.html", function() {
								//									init_showstep();
								//									resizeInput(layero);
								var _getTpl = $('#PersonSee_lyui').html(),
									project_show = $('#PersonSee_show_layui');
								laytpl(_getTpl).render(d, function(html) {
									project_show.html(html);
								});

								//									if(d.partakeProject) { // 判断参与项目
								//										layero.find('#canyuxiangmu_boxs').show()
								var data_1 = d.partakeProject;
								if(!data_1) {
									data_1 = [];
								}
								RenYuanGongGong.Participation_project(layero, data_1);
								//									}
								//									if(d.punishRecord) { // 判断被处罚单位
								//										layero.find('#beichufajilu_boxs').show()
								var data_2 = d.punishRecord;
								if(!data_2) {
									data_2 = [];
								}
								RenYuanGongGong.Penalty_record(layero, data_2);
								//									}

								//所属部门
								var treeObj = $.fn.zTree.getZTreeObj("xiaqujiandujigou_tree");
								var _selectNodes = treeObj.getSelectedNodes(); //获取当前选中的组织机构		
								if(_selectNodes && _selectNodes.length == 1) {
									var selectOrgId = _selectNodes[0].id;
									Mydao.ajax({
										'orgid': selectOrgId,
									}, 'organization/finddepgroup', function(result) {
										var currentTime = result.serverTime;
										if(result.code == 200) {
											$.each(result.result, function(a, b) {
												if(selectOrgId == b.id) {
													$("#organizationname").html(b.name);
												}
											});
										} else {
											layer.msg(result.msg);
										}
									});
								}
								var lawlicenseback = d.lawlicensefile;
								var identityback = d.idcardfile;
								var jobentityback = d.jobtitlefile;
								var offientityback = d.officefile;
								if(lawlicenseback) {
									var lawlicenseback_array = lawlicenseback.split(",");
									for(var i = 0; i < lawlicenseback_array.length; i++) {
										$('#lawlicensefile').append("<img src='" + MydaoFileDownPath + "?fileId=" + lawlicenseback_array[i] + "' width='100px'/>");
									}
								}
								if(identityback) {
									var identityback_array = identityback.split(",");
									for(var z = 0; z < identityback_array.length; z++) {
										$('#idcardfile').append("<img src='" + MydaoFileDownPath + "?fileId=" + identityback_array[z] + "' width='100px'/>");
									}
								}

								if(jobentityback) {
									var jobentityback_array = jobentityback.split(",");
									for(var c = 0; c < jobentityback_array.length;c++) {
										$('#jobtitlefile').append("<img src='" + MydaoFileDownPath + "?fileId=" + jobentityback_array[c] + "' width='100px'/>");
									}
								}
								if(offientityback) {
									var offientityback_array = offientityback.split(",");
									for(var x = 0; x < offientityback_array.length; x++) {
										$('#officefile').append("<img src='" + MydaoFileDownPath + "?fileId=" + offientityback_array[x] + "' width='100px'/>");
									}
								}

								//									Mydao.initselect(layero, null, function() {
								//										Mydao.setform($('#DepartmentForm'), result);
								//									}); //加载select

								//资格证书列表
								person_aptitude_list(row);

								//									Mydao.showPerson = true;
								//
								//									Mydao.dialogid_jdzx = index;
								//
								//									checkPerson();
								//
								//									$("select[name='checkflag']").trigger("change");
								//
								//									layero.find("select,input,textarea").attr("disabled", "disabled");
								//									setTimeout(function() {
								//										layero.find(".layui-upload-button,.fa-times-circle").remove();
								//										layero.find(".layui-layer-btn").remove();
								//									}, 500)

								$('#DepartmentLayer #Qualificationtable,#PersonSee_Qualificationtable').bootstrapTable('hideColumn', "flag");

							});
						});
					},
					cancel: function(layero, index) {
						Mydao.showPerson = false;
						index.find("input,select").val("");
					}
				});
			} else {
				layer.msg(result.msg);
			}
		});
	};

	var person_aptitude_list = function(row) {
		var id = -1;
		if(row) id = row.id;
		$('#DepartmentLayer #Qualificationtable,#PersonSee_Qualificationtable').bootstrapTable({
			method: 'post',
			url: Mydao.config.path + 'personAptitude/list',
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result.rows;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.params.personid = id;
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '证书名称',
				field: 'name',
			}, {
				title: '证书编号',
				field: 'identity',
			}, {
				title: '类型',
				field: 'type',
				formatter: function(value, row, index) {
					return Data.LX(value);
				}
			}, {
				title: '注册单位',
				field: 'company',
			}, {
				title: '注册专业',
				field: 'specialty',
			}, {
				title: '有效期',
				field: 'expiry',
				formatter: function(value, row, index) {
					return Mydao.formatDate(value, 'YYYY.MM.DD');
				}
			}, {
				title: '证书状态',
				field: 'statusName',
			}, {
				title: '附件',
				field: 'file',
				align: 'center',
				formatter: function(value, row, index) {
					if(value)
						return '<img style="width:40px;height:40px;" src="' + MydaoFileDownPath + '?fileId=' + value + '">';
					else
						return '';
				}
			}, {
				title: '操作<a id="add_qualification" herf="javascript:;" class="ml10" title="添加资质证书"><i class="fa fa-plus-square-o"></i></a>',
				field: 'flag',
				align: 'center',
				formatter: function(value, row, index) {
					return Mydao.operator(['edit', 'del']);
				},
				events: Mydao.operatorEvents({
					edit: person_aptitude_edit,
					del: person_aptitude_del
				})
			}]
		});
	};

	//添加
	var person_aptitude_add = function() {
		$("#add_qualification").click(function() {
			layer.open({
				type: 1,
				title: '添加资质证书',
				btnAlign: 'c',
				content: '',
				area: ["440px", "400px"],
				moveOut: true,
				btn: ['保存'],
				cancel: function(layero, index) {
					index.find("input,select").val("");
				},
				success: function(layero, index) {
					layero.find('.layui-layer-content').load("view/InstitutionalPersonnel/PersonneChilds/personAptitude.html", function() {
						Mydao.initselect(layero); //加载select
						resizeInput(layero);
						layero.find("input,select").val("");
					});
				},
				yes: function(index, layero) {
					layero.find("form").trigger("validate");
					if(!layero.find("form").data("validator").isFormValid()) return false;
					var setform = layero.find("#certificateLayer_form").serializeJson();
					var statusName = $("select[name='status'] option[value='" + setform.status + "']").text();
					setform.expiry = Date.parse(setform.expiry);
					setform.statusName = statusName;
					setform.flag = 0;
					setform.personid = $("#DepartmentForm input[name='id']").val();
					$('#DepartmentLayer #Qualificationtable').bootstrapTable("append", setform);
					layer.close(index);

				}
			});
		});
	};

	//		删除
	var center_del = function(e, value, row, index) {
		layer.open({
			title: '消息提示',
			content: '确定要删除该用户吗？',
			btn: ['确认', '取消'],
			btnAlign: 'c',
			success: function(layero, index) {},
			yes: function(index, layero) {
				Mydao.ajax({
					"id": row.id
				}, 'person/delete', function(result) {
					layer.close(index);
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert(result.msg);
						//刷新页面
						$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.msg(result.msg);
					}

				});
			}
		});
	};
	//		生成用户
	var center_user = function(e, value, row, index) {
		layer.open({
			type: 1,
			title: '生成用户',
			btnAlign: 'c',
			content: $('#Personnel #GenerateUserLayer').html(),
			area: ["340px", "280px"],
			btn: ['保存', '返回'],
			success: function(layero, index) {
				resizeInput(layero);
				layero.find("input,select").val("");
				Mydao.initselect(layero); //加载select
			},
			yes: function(index, layero) {
				layero.find("form").trigger("validate");
				if(!layero.find("form").data("validator").isFormValid()) return false;
				Mydao.ajax({
					"personid": row.id, //用户ID
					"loginname": layero.find("#username").val(), //用户名
					"roleid": layero.find("#roleSel option:selected").val(), //人员ID
				}, 'person/createUser', function(result) {
					layer.close(index);
					var currentTime = result.serverTime;
					if(result.code == 200) {
						layer.alert(result.msg);
						//刷新列表
						$('#xiaqujiandujigou_table').bootstrapTable("refreshOptions", {
							pageNumber: 1
						}).bootstrapTable("refresh");
					} else {
						layer.alert(result.msg);
					}
				});
			},
			cancel: function(layero, index) {
				index.find("input,select").val("");
			},
			btn2: function(index, layero) {
				layero.find("input,select").val("");
			}
		});
	};

	function personList() {
		$('#xiaqujiandujigou_table').bootstrapTable({
			pagination: true,
			sidePagination: 'server',
			queryParamsType: "undefined", //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  //设置为limit可以获取limit, offset, search, sort, order  
			method: 'post',
			pageNumber: 1,
			url: Mydao.config.path + 'person/list',
			cache: true, //禁用缓存
			search: false, //禁用查询
			striped: true, //隔行变色
			uniqueId: "id", //唯一标识,
			responseHandler: function(res) { //设置返回数据
				if(res.code == 200) {
					return res.result;
				}
			},
			ajaxOptions: {
				ContentType: 'application/json',
				dataType: 'json'
			},
			queryParams: function(p) {
				Mydao.config.ajaxParams.params = {};
				Mydao.config.ajaxParams.page.orderField = p.orderField;
				Mydao.config.ajaxParams.page.pageSize = p.pageSize;
				Mydao.config.ajaxParams.page.pageCurrent = p.pageNumber;
				Mydao.config.ajaxParams.page.orderDirection = p.sortOrder;
				if(Mydao.currentPage.params.orgid_jdzxs && Mydao.currentPage.params.orgid_jdzxs.length != 0) {
					Mydao.config.ajaxParams.params.organizationids = Mydao.currentPage.params.orgid_jdzxs;
				}
				if(Mydao.currentPage.params.name) {
					Mydao.config.ajaxParams.params.name = Mydao.currentPage.params.name;
				}
				return Mydao.config.ajaxParams;
			},
			columns: [{
				title: '序号',
				formatter: function(val, row, index) {
					return index + 1;
				}
			}, {
				title: '姓名',
				field: 'name',
				formatter: Mydao.nameFormatter,
				events: {
					'click a': showPerson
				}
			}, {
				title: '职务',
				field: 'postname',
			}, {
				title: '职称',
				field: 'jobtitle',
				formatter: function(value, row, index) {
					return Data.Zhicheng(value);
				}
			}, {
				title: '用户名',
				field: 'loginname',
			}, {
				title: '状态',
				field: 'status',
				formatter: function(val) {
					var status = ["启用", "禁用"];
					return status[val];
				}
			}, {
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					var ctrls = [];
					if(Mydao.permissions['person_edit']) {
						ctrls.push('edit');
					}
					if(Mydao.permissions['person_del']) {
						ctrls.push('del');
					}
					if(row.loginname == null && Mydao.permissions['person_user']) {
						ctrls.push('mduser');
					}
					return Mydao.operator(ctrls);
				},
				events: Mydao.operatorEvents({
					edit: center_edit,
					del: center_del,
					mduser: center_user
				})
			}]
		});
	}
	//调整 隐藏的权重布局 计算它的宽度
	var checkPersonNone = function() {
		$('#DepartmentLayer').find(".group-input").each(function(index, element) {
			$(element).width($(element).parent().width() - $(element).prev().outerWidth(true) - 22);
		});
	};
	/*判断权重显示隐藏*/
	var checkPerson = function() {
		var QZ = $('#weightOut'), //权重
			JCRY = $("select[name='checkflag']"), // 检查人员
			RYFL = $("#Personnel_classification"); //人员分类
		$("select[name='checkflag']").change(function() {
			var val = $(this).val();
			if(val == 1 || 　RYFL.val() == 1102) {
				QZ.show();
				checkPersonNone();
			} else {
				QZ.hide();
			}
		});
		$("#Personnel_classification").change(function() {
			var val = $(this).val();
			if(val == 1102 || JCRY.val() == 1) {
				QZ.show();
				checkPersonNone();
			} else {
				QZ.hide();
			}
		});
	};
})();