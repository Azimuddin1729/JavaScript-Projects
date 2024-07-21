//we will listen to events now:

document.addEventListener('DOMContentLoaded', ()=> {
    const grid=document.querySelector('.grid');
    const flagsleft=document.querySelector('#flag');
    const result=document.querySelector('.result');
    // console.log(grid);
    // console.log(flagsleft);
    // const grid1=document.getElementsByClassName('grid');
    // console.log(grid1);
    let gameplay=true;
    let bombAmount=16;
    let size =10;
    let squares=[];
    function createBoard(){
        // flagsleft.innerHTML='<div>high</div>';
     
         flagsleft.innerHTML=bombAmount;

         let array=[];
         for(let i=0;i<size*size;i++){
            if(i<bombAmount)
              array.push('bomb')
            else
              array.push('safe')
         }
           
        array.sort(()=>Math.random()-0.5);
        //  console.log(array);

         for(let i=0;i<size*size;i++){


            const square=document.createElement('div');
            square.id=i;
            // square.setAttribute('id',i);
            square.classList.add(array[i]);
            // square.class=array[i];
            grid.appendChild(square);
            squares.push(square);
            square.addEventListener('click',function(e){
                click(square);
            });

            square.oncontextmenu=function(e){
                e.preventDefault();
                addFlag(square);


            }


         }
         
    }
    createBoard();
    bombNumbersDisplay();

   function bombNumbersDisplay(){
       for(let i=0;i<size*size;i++){
             let cnt=0;
            if(squares[i].classList.contains('safe')){
                if(i%size!=0&&squares[i-1].classList.contains('bomb')){
                    cnt++;
                }//left side 
                if(i>size-1&&squares[i-size].classList.contains('bomb')){
                    cnt++;
                }//up side
                if(i>size-1&&i%size!=0&&squares[i-1-size].classList.contains('bomb')){
                    cnt++;
                }//up left side
                if(i>size-1&&i%size!=size-1&&squares[i+1-size].classList.contains('bomb')){
                    cnt++;
                }//up right side
                if(i%size!=size-1&&squares[i+1].classList.contains('bomb')){
                    cnt++;
                }//right side
                if(i<size*size-size&&i%size!=0&&squares[i-1+size].classList.contains('bomb')){
                    cnt++;
                }//down left side
                if(i<size*size-size&&i%size!=size-1&&squares[i+1+size].classList.contains('bomb')){
                    cnt++;
                }//down right side
                if(i<size*size-size&&squares[i+size].classList.contains('bomb')){
                    cnt++;
                }//down side
                squares[i].setAttribute('quantity',cnt);
                // console.log(squares[i]);
            }
       }
   }
   function click(square){
    //  console.log(square);
    if(!gameplay){
      return;
    }
    else if(square.classList.contains('bomb')){
        gameOver();
        return;
    }
    else{
         if(square.classList.contains('checked')||square.classList.contains('flag')){
             return;
         }
         else{
            let bombs=square.getAttribute('quantity');
            if(bombs!=0){
                square.innerHTML=bombs;
                square.classList.add('checked');
                return;
            }
            else{
                // square.classList.add('checked');
                spread(square);

            }

         }
         square.classList.add('checked');
    }

   }
//    function spread(square){
//       //check all 8 directions
//         // console.log("count");
//         const pos=square.id;
//         console.log(pos);
//         const bombs=square.getAttribute('quantity');
//         square.classList.add('checked');
//         if(bombs!=0){
//             square.innerHTML=bombs;
//             return;
//         }
//         if(pos%size!=0&&!squares[pos-1].classList.contains('checked')){//left side
//             spread(squares[pos-1]);
//         }
//         if(pos>size-1&&!squares[pos-size].classList.contains('checked')){//up side
//             spread(squares[pos-size]);
//         }
//         if(pos>size-1&&pos%size!=0&&!squares[pos-1-size].classList.contains('checked')){//up left side
//             spread(squares[pos-1-size]);
//         }
//         // if(pos>size-1&&(pos%size!=size-1)&&(!squares[pos+1-size].classList.contains('checked'))){//up right side
//         //     spread(squares[pos+1-size]);
//         // }
//         if(pos%size!=size-1&&!squares[pos+1].classList.contains('checked')){//right side
//             spread(squares[pos+1]);
//         }
//         if(pos<size*size-size&&!squares[pos+size].classList.contains('checked')){//down side
//             spread(squares[pos+size]);
//         }
//         if(pos<size*size-size&&pos%size!=0&&!squares[pos-1+size].classList.contains('checked')){//down left side
//             spread(squares[pos-1+size]);
//         }
//         if(pos<size*size-size&&pos%size!=size-1&&!squares[pos+1+size].classList.contains('checked')){//down right side
//             spread(squares[pos+1+size]);
//         }
//         // return;
//    }
   function spread(square){
    const pos=parseInt(square.id);
    const bombs=square.getAttribute('quantity');
    const leftbou=(pos%size==0);
    const rightbou=(pos%size==size-1);
     setTimeout(function(){
         if(!leftbou){
             const newpos=squares[pos-1];
             click(newpos);// left
         }
            if(pos>size-1){
                const newpos=squares[pos-size];
                click(newpos);//up
            }
            if(pos>size-1&&!rightbou){
                const newpos=squares[pos+1-size];
                click(newpos);//up right
            }
            if(pos<size*size-size){
                const newpos=squares[pos+size];
                click(newpos);//down
            }
            if(pos<size*size-size&&!leftbou){
                const newpos=squares[pos-1+size];
                click(newpos);//down left
            }
            if(pos<size*size-size&&!rightbou){
                const newpos=squares[pos+1+size];
                click(newpos);//down right
            }
            if(!rightbou){
                const newpos=squares[pos+1]
                click(newpos);//right
            }
            if(pos>size-1&&!leftbou){
                const newpos=squares[pos-1-size];
                click(newpos);//up left
            }
     },1000);
    
   }

   function addFlag(square){
       if(!gameplay){
           return;
       }
       if(!square.classList.contains('checked')&&flagsleft.innerHTML>0){
           if(!square.classList.contains('flag')){
               square.classList.add('flag');
               square.innerHTML='🚩';
               flagsleft.innerHTML--;
               checkForWin();
           }
           else{
               square.classList.remove('flag');
               square.innerHTML='';
               flagsleft.innerHTML++;
           }
       }
    }

    function checkForWin(){
        let matches=0;
        for(let i=0;i<squares.length;i++){
            if(squares[i].classList.contains('flag')&&squares[i].classList.contains('bomb')){
                matches++;
            }
            if(matches==bombAmount){
                result.innerHTML='YOU WIN!';
                gameplay=false;
            }
        }


    }


   function gameOver(){
         result.innerHTML='BOOM! GAME OVER!';
         gameplay=false;
         squares.forEach(square=>{
              if(square.classList.contains('bomb')){
                square.innerHTML='💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
              }
         });
   }

}); //after the page is loaded, we will run the script inside the function