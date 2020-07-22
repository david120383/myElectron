document.getElementById("loading").style.display="none";
document.getElementById("btnLoad").addEventListener("click", selectDevice);
document.getElementById("btnUpdateAll").addEventListener("click", updateAllFirmware);
document.getElementById("btnSelectAll").addEventListener("click", checkAll);

function checkAll() {
    $('.check').prop("checked", true);
    // if($('#chkSelectAll').prop("checked")) {
    //     $('.check').prop("checked", true);
    // }else{
    //     $('.check').prop('checked',false);
    // }
}
function updateAllFirmware() {
    const checkList = $('.check');
    const checkedList = [];
    let checkString = "";
    let checkStringPort = "";
    for(let i=0; i<checkList.length; i++){
        if(checkList[i].checked){
            checkedList.push(checkList[i].name);
            checkString += checkList[i].name + "|";
            checkStringPort += checkList[i].attributes[3].value + "|";
        }
    }
    if(checkedList.length == 0){
        alert("请选择要升级固件的设备");
    }else{
        checkString = checkString.substring(0,checkString.length-1);
        checkStringPort = checkStringPort.substring(0,checkStringPort.length-1);
        console.log(checkString);
        console.log(checkStringPort);
        $.ajax({
            url: 'http://localhost:8081/dfuall?name=' + checkString + '&port=' + checkStringPort,
            type: 'GET',
            dataType: 'json',
            success: function (d) {
                console.log(d);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}
function selectDevice() {
    $.ajax({
        url:'http://localhost:8081/list2',
        type:'GET',
        dataType:'json',
        beforeSend: function(){
            // $("#loading").show();
        },
        complete: function(){
            $("#loading").hide();
        },
        success:function (d) {
            if(d.result == "success"){
                const data = d.data;
                let htmlDetail = "";
                for (let i = 0; i < data.length; i++) {
                    const obj = JSON.parse(data[i].details);
                    const obj2 = data[i].port;
                    htmlDetail += '<tr>';
                    htmlDetail += '    <td><input class="check" type="checkbox" name="' + obj.Address + '" tag="' + obj2 + '" ></td>';
                    htmlDetail += '    <td>MDPS-' + obj.Address + '</td>';
                    htmlDetail += '    <td>' + obj.mac + '</td>';
                    htmlDetail += '    <td id="firmware' + obj.Address + '"></td>';
                    htmlDetail += '    <td>';
                    htmlDetail += '        <p id="status' + obj.Address + '0" style="display:none;">';
                    htmlDetail += '        </p>';
                    htmlDetail += '        <p id="status' + obj.Address + '1" style="display:none;">';
                    htmlDetail += '        上次升级成功<br>';
                    htmlDetail += '        </p>';
                    htmlDetail += '        <p id="status' + obj.Address + '2" style="display:none;">';
                    htmlDetail += '        上次升级失败<br>';
                    htmlDetail += '        </p>';
                    htmlDetail += '        <p id="status' + obj.Address + '3" style="display:none;">';
                    htmlDetail += '        正在升级<br>';
                    htmlDetail += '        </p>';
                    htmlDetail += '        <button class="btnUpdate" name="' + obj.Address + '" id="status' + obj.Address + '4" >升级最新固件</button>';
                    htmlDetail += '    </td>';
                    htmlDetail += '</tr>';
                }
                $('#mdpstbody').html(htmlDetail);
                for(let j=0; j<data.length; j++){
                    const objCheck = JSON.parse(data[j].details);
                    $('#status' + objCheck.Address + '4').click(function () {
                        updateFirmware(objCheck.Address);
                    });
                    $.ajax({
                        url: 'http://localhost:8081/checkdfustatus?name=' + objCheck.Address,
                        type: 'GET',
                        dataType: 'json',
                        success: function (d) {
                            if(d.result == "success"){
                                $('#firmware' + d.name ).html(d.firmware);
                                if(d.status == "success"){
                                    let endTime = dateFormart(d.end);
                                    $('#status' + d.name + '1').html("上次升级成功时间"+ endTime);
                                    $('#status' + d.name + '1').show();
                                }else if(d.status == "failed"){
                                    $('#status' + d.name + '2').show();
                                }else if(d.status == "doing"){
                                    $('#status' + d.name + '3').html("正在升级");
                                    $('#status' + d.name + '3').show();
                                    // $('#status' + d.name + '4').hide();
                                }else if(d.status == "waiting"){
                                    $('#status' + d.name + '3').html("正在等待升级");
                                    $('#status' + d.name + '3').show();
                                    // $('#status' + d.name + '4').hide();
                                }
                            }else if(d.result == "failed"){
                                $('#status' + d.name + '0').show();
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            }else{
                $('#mdpstbody').html('');
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function updateFirmware(name) {
    $.ajax({
        url: 'http://localhost:8081/check?name=' + name,
        type: 'GET',
        dataType: 'json',
        success: function (d) {
            console.log(d);
            if(d.check == true){
                $.ajax({
                    url: 'http://localhost:8081/dfu?name=MDPS-' + name,
                    type: 'GET',
                    dataType: 'json',
                    success: function (d) {
                        console.log(d);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }else{
                alert("此设备已被拔出，请点击【加载设备】按钮。")
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function dateFormart(d) {
    let thisdate = new Date(d);
    let fmt = "yyyy-MM-dd hh:mm:ss";
    const o = {
        "M+": thisdate.getMonth() + 1, //月份
        "d+": thisdate.getDate(), //日
        "h+": thisdate.getHours(), //小时
        "m+": thisdate.getMinutes(), //分
        "s+": thisdate.getSeconds(), //秒
        "q+": Math.floor((thisdate.getMonth() + 3) / 3), //季度
        "S": thisdate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (thisdate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
