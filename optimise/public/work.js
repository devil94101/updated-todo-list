$(document).ready(async function(){
    var todo=await $.getJSON('/api');
    var active="all";
    var edit=0;
    showtodo(todo);
    $('.todo').on('click','.text',function(e){
        if(e.detail==1)
        {
            let t=$(this).parent().data('isCompleted');
            if(t===true){
                if(active==="completed"){
                    $(this).parent().toggleClass('hidd');
                }
            }
            else{
                if(active==="active"){
                    $(this).parent().toggleClass('hidd');
                }
            }
            update($(this));
        }
    });
    $('.todo').on('click','.delete',function(){
        delet($(this));
    });
    $('.form').on('submit',function(e){
        e.preventDefault();
        create();
    });
    $('.all').on('click',function(){
        $('.head').html('All');
        if(active!="all"){
            $('.all').toggleClass('high');
        }n
        if(active=='completed'){
            $('.todo li').each(function(ele){
                if($(this).data('isCompleted')==false){
                    $(this).toggleClass('hidd');
                }
            });
            $('.completed').toggleClass('high');
        }
        else if(active=="active"){
            $('.todo li').each(function(ele){
                if($(this).data('isCompleted')){
                    $(this).toggleClass('hidd');
                }
            });
            $('.active').toggleClass('high');
        }
        active="all";
    });
    $('.active').on('click',function(){
        $('.head').html('Active');
        if(active!=="active"){
            $('.active').toggleClass('high');
        }
        if(active=='completed'){
            $('.todo li').each(function(ele){
                $(this).toggleClass('hidd');
            });
            $('.completed').toggleClass('high');
        }
        else if(active=="all"){
            $('.todo li').each(function(ele){
                if($(this).data('isCompleted')){
                    $(this).toggleClass('hidd');
                }
            });
            $('.all').toggleClass('high');
        }
        active="active";
    });
    $('.completed').on('click',function(){
        $('.head').html('Completed');
        if(active!=="completed"){
            $('.completed').toggleClass('high');
        }
        if(active=='all'){
            $('.todo li').each(function(ele){
                if($(this).data('isCompleted')==false){
                    $(this).toggleClass('hidd');
                }
            });
            $('.all').toggleClass('high');
        }
        else if(active=="active"){
            $('.todo li').each(function(ele){
                $(this).toggleClass('hidd');
            });
            $('.active').toggleClass('high');
        }
        active="completed";
    });
    $('.clear').on('click',function(){
        deleteMany();
        $('.todo li').each(function(ele){
            if($(this).data('isCompleted')){
                $(this).remove();
            }
        });
    });
    $('.cmp-all').on('click',function(){
        updateMany();
        $('.todo li .text').each(function(ele){
            if($(this).parent().data('isCompleted')===false){
                if(active=="active"||active=="completed"){
                    $(this).parent().toggleClass('hidd');
                }
                $(this).toggleClass('comp');
                $(this).parent().data('isCompleted',true);
            }
        });

    });
    $('.todo').on('click','.ebtn',function(){
        let cng=(`<form id="edit">
        <input type="text">
        <button type="submit" class="btn">Submit</button>
    </form>`);
        let data=$(this).siblings('.text').html();
        $(this).parent().html(cng);
        $('#edit input').focus();
        $("#edit input").val(data);
        $('#edit').on('submit',function(e){
           e.preventDefault();
           let val=$('#edit input').val();
           updateText($(this),val);
           let v=$( `<span class="text ${$(this).parent().data('isCompleted') ? 'comp' : ''}">${val}</span>  <button class="delete"> Delete </button> <button class="ebtn">edit</button></<span>`)
            $(this).parent().html(v);
        });
        $('#edit').on('blur','input',function(){
            $('#edit').trigger('submit');
        });
    });
});
function showtodo(todo){
    for(let i of todo){
        show(i);
    }
}
function show(ele){
    let val=$( `<li><span class="text ${ele.isCompleted ? 'comp' : ''}">${ele.task} </span>  <button class="delete"> Delete </button> <button class="ebtn">edit</button></li>`);
    $('.todo').prepend(val);
    val.data('id',ele._id);
    val.data('isCompleted',ele.isCompleted);
}
async function update(ele){
    let t=ele.parent().data('isCompleted');
    await $.ajax({
        type:'PUT',
        url:`/api/${ele.parent().data('id')}`,
        data:{isCompleted: !t}
    });
    ele.toggleClass('comp');
    ele.parent().data('isCompleted',!t);
}
async function delet(ele){
    await $.ajax({
        type:'DELETE',
        url: `/api/${ele.parent().data('id')}`
    });
    ele.parent().remove();
}
async function create(){
    let input=$('.input').val();
    $('.input').val('');
    $('.input').focus(); 
    let data=await $.ajax({
        type:'POST',
        url:"/api/",
        data:{task:input}
    });
    show(data);
}
async function updateText(ele,val){
    await $.ajax({
        type:'PUT',
        url:`/api/${ele.parent().data('id')}`,
        data:{task:val}
    });
}
async function deleteMany(){
    await $.ajax({
        type:'DELETE',
        url:'/api/',
        data:{isCompleted:true}
    });
}
async function updateMany(){
    await $.ajax({
        type:'PATCH',
        url:'/api/',
        data:{'isCompleted':false}
    });
}