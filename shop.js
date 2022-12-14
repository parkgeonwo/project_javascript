

///////////////////////// 모달창


// 로그인버튼
$('.btn-buy').on('click',function(){
    $('.black-bg-modal').toggleClass('show-modal')
})

$('#close').on('click',function(){
    $('.black-bg-modal').toggleClass('show-modal')
})

document.getElementsByClassName('btn-submit')[0].addEventListener('click', function(e){
    var idValue = document.getElementsByClassName('form-control')[0].value;
    var passwordValue = document.getElementsByClassName('form-control')[1].value;
    if( idValue == ''){
      alert('성함을 입력해주세요')
      e.preventDefault();
    }
    else if(passwordValue == ''){
        alert('연락처를 입력해주세요')
        e.preventDefault();
    }
    else if(/-/.test( passwordValue )){
        alert('-기호를 빼주세요')
        e.preventDefault();
    } else{
        showCanvas();
        e.preventDefault();
    }
  });

// 검은부분 클릭하면 모달창 닫기
document.querySelector('.black-bg-modal').addEventListener('click',function(e){
    // console.log(e.target);
    // console.log(document.querySelector('.black-bg'));
    if (e.target==document.querySelector('.black-bg-modal')){
        document.querySelector('.black-bg-modal').classList.toggle('show-modal');
    }
})




////////////////////////// json파일에서 데이터 가져와서 card 그리기

$.get('./store.json').done((data)=>{  // json에서 데이터를 가져온다.
    data['products'].forEach((a,i)=>{  // 가져온 데이터를 하나씩 뽑아냄

        // 변수에 html을 담고
        let cardContent = `
        <div class="col" draggable="true" ondragstart="drag(event)" data-cardid="${a['id']}">
            <div class="card">
            <img src="./img/${a['photo']}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${a['title']}</h5>
                <p class="card-text">${a['brand']}</p>
                <p class="price-text">가격 : ${a['price']}</p>
                <button type="button" class="btn btn-dark btn-push-cart" data-id="${a['id']}">담기</button>
            </div>
            </div>
        </div>`

        $('.totalCardDiv').append(cardContent);  // append 해주기
    })
})

///////////////// 검색기능 + 글자 배경색 칠하기
$('.search').on('input',function(){
    let inputText = $(this).val();  // input에 적힌 value
    // console.log(inputText);

    $.get('./store.json').done((data)=>{  // json에서 데이터를 가져온다.
        $('.totalCardDiv').html(''); // 검색시 card 삭제
        data['products'].forEach((a,i)=>{  // 가져온 데이터를 하나씩 뽑아냄
            
            if ( String(a['title']).includes(inputText) || String(a['brand']).includes(inputText)  ){ // input 내용이 title/brand에 포함되면
                
                // title과 inputText가 같은 부분 칠해주기 위한 replace
                var regexAllCase = new RegExp(inputText, "gi");   // 대소문자 구분 없이 모든 패턴을 찾음
                let cardTitleText = String(a['title']).replace(regexAllCase, `<span style="background : yellow">${inputText}</span>`) 
                // brand과 inputText가 같은 부분 칠해주기 위한 replace
                var regexAllCase = new RegExp(inputText, "gi");   // 대소문자 구분 없이 모든 패턴을 찾음
                let cardBrandText = String(a['brand']).replace(regexAllCase, `<span style="background : yellow">${inputText}</span>`)

                // 변수에 html을 담고
                let cardContent = `
                <div class="col">
                    <div class="card" draggable="true" ondragstart="drag(event)" data-cardid="${a['id']}">
                    <img src="./img/${a['photo']}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${cardTitleText}</h5>
                        <p class="card-text">${cardBrandText}</p>
                        <p class="price-text">가격 : ${a['price']}</p>
                        <button type="button" class="btn btn-dark btn-push-cart" data-id="${a['id']}">담기</button>
                    </div>
                    </div>
                </div>`

                $('.totalCardDiv').append(cardContent);  // append 해주기
            }
        })
    })
})




///////////// 담기 버튼 누르면 드래그 박스에 카드 생성

// 몇개가 들어있는지 확인하기 위한 array 생성하고 로컬스토리지에 저장
let cartArray = [];

$.get('./store.json').done((data)=>{  // json에서 데이터를 가져온다.
    data['products'].forEach((a,i)=>{  // 가져온 데이터를 하나씩 뽑아냄
        let obj = {'id':a['id'], '수량':0, '가격':a['price'],'title':a['title'], 'brand':a['brand'] };
        cartArray.push(obj); // cartArray에 데이터 저장
        // console.log(cartArray);
    });
    var newCartArray = JSON.stringify(cartArray); // json으로 변경
    localStorage.setItem('CartArray', newCartArray); // 저장
})


// 드래그 박스에 카드 그려주고, 수량 변화시키는 함수
function drawCard(index){   // index는 해당 카드의 id 번호
    if(  String( $('.dragDiv').text() ).includes('여기로 드래그') ){  // dragDiv에 "여기로 드래그"가 있다면 삭제
        $('.dragDiv').text('')
    }
    $('.dragDiv').css('color','black'); // font color 변경
    $('.dragDiv').css('font-size','16px'); // font size 변경

    // localstorage에 저장된 정보 가져오기
    var getArray = localStorage.getItem('CartArray'); // 불러오고
    getArray = JSON.parse(getArray);  // json으로 변경

    $.get('./store.json').done((data)=>{  // json에서 데이터를 가져온다.
        data['products'].forEach((a,i)=>{  // 가져온 데이터를 하나씩 뽑아냄

            if(index == a['id']){  // e.target.dataset.id 와 a['id']가 같을때만 dragDiv에 추가하기

                if( getArray[a['id']]['수량']==0 ){         // localstorage에 저장된 수량이 0 일때만

                    getArray[a['id']]['수량'] = parseInt(getArray[a['id']]['수량']) + 1 ;  // 수량추가

                    // 변수에 html을 담고
                    let cardContent = `
                    <div class="m-2" style="width:20%;">
                        <div class="card">
                        <img src="./img/${a['photo']}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${a['title']}</h5>
                            <p class="card-text">${a['brand']}</p>
                            <p class="price-text">가격 : ${a['price']}</p>
                            <input class="input-${a['id']}" id="input-id" data-id="${a['id']}" type="text" style="width: 80%;" value="${getArray[a['id']]['수량']}">
                        </div>
                        </div>
                    </div>`
            
                    $('.dragDiv').append(cardContent);  // append 해주기

                    var newgetArray = JSON.stringify(getArray);  // 다시 json으로 변경
                    localStorage.setItem('CartArray', newgetArray);  // 저장

                } else if (getArray[a['id']]['수량']!=0){     // 수량이 0이 아니라면 == 장바구니에 들어있다면
                    getArray[a['id']]['수량'] = parseInt(getArray[a['id']]['수량']) + 1 ;  // 수량추가

                    var id = String(a['id']);
                    $('.input-'+ id).val(getArray[a['id']]['수량']);

                    var newgetArray = JSON.stringify(getArray);  // 다시 json으로 변경
                    localStorage.setItem('CartArray', newgetArray);  // 저장
                }
            }
        })
    }); // .done

    ////////////////////// 합계 계산하기 (버튼이나 드래그앤드랍했을때, 시간텀을주고)
    setTimeout(function(){
        var sum = 0;
        getArray.forEach((a,i)=>{
            sum += a['수량'] * a['가격'];
        })
        $('.total-price').html('합계 : '+String(sum))
    },100)
}


// 버튼 클릭시
$(document).on('click','.btn-push-cart',function(e){
    drawCard(e.target.dataset.id);
})


////////////////////////////// 드래그/드랍시 드래그 박스에 카드 생성

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.cardid);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    drawCard(data);
}



///////////////////////////// 합계 계산하기 ( input 변경시 )

function inputChange(index){
    // localstorage에 저장된 정보 가져오기
    var getArray = localStorage.getItem('CartArray'); // 불러오고
    getArray = JSON.parse(getArray);  // json으로 변경

    getArray[index]['수량'] = parseInt( $('.input-'+ index).val() ) ;  // 수량변경

    var newgetArray = JSON.stringify(getArray);  // 다시 json으로 변경
    localStorage.setItem('CartArray', newgetArray);  // 저장

    // 시간텀을주고 합계 계산
    setTimeout(function(){
        var sum = 0;
        getArray.forEach((a,i)=>{
            sum += a['수량'] * a['가격'];
        })
        $('.total-price').html('합계 : '+String(sum))
    },100)
}

// input 변경시
$(document).on('change','#input-id',function(e){
    inputChange(e.target.dataset.id);
})



///////////// canvas

function showCanvas(){
    $('.black-bg-canvas').toggleClass('show-modal')
    writeCanvas();
}

// 검은부분 클릭하면 모달창 닫기
document.querySelector('.black-bg-canvas').addEventListener('click',function(e){
    if (e.target==document.querySelector('.black-bg-canvas')){
        document.querySelector('.black-bg-canvas').classList.toggle('show-modal');
    }
})

function writeCanvas(){
    var canvas = document.getElementById('canvas'); 
    var title = canvas.getContext('2d');
    title.font = '30px dotum';
    title.fillText('영수증', 40, 30);

    const date = new Date();

    var time = canvas.getContext('2d');
    time.font = '15px dotum';
    time.fillText(date.toLocaleString(), 40, 70);

    var getArray = localStorage.getItem('CartArray'); // 불러오고
    getArray = JSON.parse(getArray);  // json으로 변경

    var sum = 0;

    getArray.forEach((a,i)=>{
        if( a['수량'] >= 1 ){
            time.fillText('제품명 :'+  a['title'], 40+200*i, 130);
            time.fillText('브랜드 :'+  a['brand'], 40+200*i, 150);
            time.fillText('수량 :'+ a['수량'], 40+200*i, 170);
            time.fillText('가격 : '+ a['가격'], 40+200*i, 190);
            time.fillText('합계 : '+ String( parseInt(a['수량'])* parseInt(a['가격']) ), 40+200*i, 230);
            sum += a['수량'] * a['가격'];
        }
    })

    time.fillText('총합계 : '+ String( sum ), 650, 400);
}



