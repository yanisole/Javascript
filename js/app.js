'use strict';

/*
NOTA: Para la codificación se utiliza cierto convenio para la definición de variables.
w_ => Variable local. Ej.: w_person.
p_ => Parámetro de método o función. Ej.: function dummy(p_param){}
*/
var Calculator = {};

Calculator = (function(){
    var input = {
        //Resultado acumulado
        accumulated: 0,
        //Último valor ingresado
        lastValue: 0,
        //Última operación ingresada: +, -, *, /.
        lastOperationBeforeEqual: '',
        //Última operación ingresada: +, -, *, /, =.
        lastOperation: '',
        //Descr: Limpia las variables del objeto
        clear: function(){
            this.accumulated = 0;
            this.lastOperationBeforeEqual = '';    
            this.lastOperation = '';        
            this.lastValue = 0;
        },
        //Descr: Calcula  el resultado de una operación.
        //Parámetros: 
        //=> p_value1: Número.
        //=> p_value2: Número.
        //=> p_operation: Operación.
        //Resultado:
        //=> Número.
        calculate: function(p_value1, p_value2, p_operation){
            var w_result = 0;

            switch(p_operation){
                case '+':
                    w_result = p_value1 + p_value2;
                    break;
                case '-':
                    w_result = p_value1 - p_value2;
                    break;
                case '*':
                    w_result = p_value1 * p_value2;
                    break;
                default: //División
                    w_result = p_value1 / p_value2;
                    break;
            }

            return w_result;
        }
    };

    var screen = {
        display: document.getElementById('display'),
        //Descr: Dice si en el display ya se alcanzo el número máximo
        //de carácteres a mostrar.
        //Resultado:
        //Verdadero o falso
        isFull: function(){
            return (this.display.innerText.length == 8);
        },
        //Descr: Lo opuesto a la función IsFull
        //Resultado:
        //Verdadero o falso
        isEmpty: function(){
            return (this.display.innerText == '0');
        },
        //Descr: Devuelve el contenido del display.
        //Resultado:
        //Si el display está "vacio", retorna '' (cadena vacía),
        //caso contrario el contenido.
        getValue: function(){
            if(this.isEmpty())
                return '';
            return this.display.innerText;
        },
        //Descr: Setea al valor mostrado en el display
        setValue: function(p_value){
            var w_value = String(p_value);
            if(w_value.length > 8)
                w_value = w_value.substring(0, 8);
            this.display.innerText = w_value; 
        },
        //Descr: Setea los mastrado en el display
        //Parámetros: 
        //=> p_char: Valor a mostrar
        //Resultado:
        //Agrega el valor de ser posible al display
        add: function(p_char){
            if(this.isFull())
                return;            
            
            if(this.isEmpty()){
                if(p_char == '.')
                    this.display.innerText = '0.';
                else
                    this.display.innerText = p_char;
            }else
                this.display.innerText += p_char;
        },
        //Descr: Limpia el display
        clear: function(){
            var w_len = 0;

            if(this.isEmpty())
                return;
            
            this.display.innerText = '0';
        }
    }

    //Descr: Muestra un mensaje de error.
    //Parámetros: 
    //=> p_err: Error
    //Resultado:
    //Muestra un alert con el mensaje de error.
    var processError = function(p_err){
        try{
            if(typeof p_err == 'string')
                alert('Error: ' + p_err);
            else
                alert('Error: ' + p_err.message);
        }catch(p_err2){ //Esto no deberia pasar, pero bue... nada es perfecto
            alert('Error: ' + p_err2);
        }
    }

    //Descr: Muestra un tecla presionada en el display de la calculadora
    //Parámetros: 
    //=> p_keyId: Tecla presionada
    //Resultado:
    //Si es una tecla válida se muestra en el display. Caso
    //contrario se informa del error.
    var keyPressed = function(p_key){
        
        try{
            screen.add(p_key);
        }catch(p_err){
            processError(p_err);
        }
    }

    //Descr: Procesa el resultado
    //Resultado:
    //Muestra el resultado en el display si todo es correcto, caso
    //contrario, muestra el error.
    var processOperation = function(p_operation){        
        var w_basicOperations = ['+', '-', '/', '*'];
        var w_value = 0, w_result = 0;        
        
        try{
            //Presiona '=' de forma consecutiva. Caso ej.: 1+2=3=5=7
            if(input.lastOperation == '=' && p_operation == '='){
                input.accumulated = input.calculate(input.accumulated, input.lastValue, input.lastOperationBeforeEqual);
                screen.setValue(input.accumulated);
                return;                
            } 

            w_value = Number(screen.getValue());            
            if(p_operation == '='){
                if(input.lastOperationBeforeEqual == ''){  
                    screen.setValue(w_value);
                    return;
                }else
                    input.accumulated = input.calculate(input.lastValue, w_value, input.lastOperationBeforeEqual);
                input.lastValue = w_value;
                input.lastOperation = p_operation;
                screen.setValue(input.accumulated);
                return;                
            }

            if(w_basicOperations.includes(p_operation))
            {
                if(input.lastOperation != '=' && input.lastOperation != '')
                    throw 'Ya existe una operación previa. Por favor presione la tecla "=" antes de continuar';

                input.lastValue = w_value;
                input.lastOperationBeforeEqual = p_operation;
                input.lastOperation = p_operation;
                screen.setValue('');
            }

        }catch(p_err){
            processError(p_err);
            return false;
        }

        return true;
    }

    var pressKeyEffect1 = function(p_element){
        p_element.style.width='27%';
        p_element.style.height='60px';
        p_element.style.marginLeft='1%';
        p_element.style.marginTop='3px';

        setTimeout(function(){ 
            p_element.style.width='29%';
            p_element.style.height='62.91px';
            p_element.style.marginLeft='0%';
            p_element.style.marginTop='0px';
        }, 100);
    }

    var pressKeyEffect2 = function(p_element){
        p_element.style.width='20%';
        p_element.style.height='60px';
        p_element.style.marginLeft='1%';
        p_element.style.marginTop='3px';

        setTimeout(function(){ 
            p_element.style.width='22%';
            p_element.style.height='62.91px';
            p_element.style.marginLeft='0%';
            p_element.style.marginTop='0px';
        }, 100);
    }

    var pressKeyEffectPlus = function(p_element){
        p_element.style.width='88%';
        p_element.style.height='98%';        

        setTimeout(function(){ 
            p_element.style.width='90%';
            p_element.style.height='100%';                        
        }, 100);
    }

    //Descr: Inicializa el módulo
    function init(){
        document.getElementById('0').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            keyPressed(0);
        });

        document.getElementById('1').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            keyPressed(1);           
        });

        document.getElementById('2').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            keyPressed(2);
        });

        document.getElementById('3').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            keyPressed(3);
        });

        document.getElementById('4').addEventListener('click', function(p_evt){
            pressKeyEffect2(this);
            keyPressed(4);
        });

        document.getElementById('5').addEventListener('click', function(p_evt){            
            pressKeyEffect2(this);
            keyPressed(5);
        });

        document.getElementById('6').addEventListener('click', function(p_evt){
            pressKeyEffect2(this);
            keyPressed(6);
        });

        document.getElementById('7').addEventListener('click', function(p_evt){
            pressKeyEffect2(this);
            keyPressed(7);
        });

        document.getElementById('8').addEventListener('click', function(p_evt){            
            pressKeyEffect2(this);
            keyPressed(8);
        });

        document.getElementById('9').addEventListener('click', function(p_evt){
            pressKeyEffect2(this);
            keyPressed(9);
        });

        document.getElementById('punto').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            if(screen.getValue().indexOf('.') >= 0)
                return;    
            keyPressed('.');
        });

        document.getElementById('por').addEventListener('click', function(p_evt){  
            pressKeyEffect2(this);          
            if(processOperation('*'))
                screen.setValue('');
        });

        document.getElementById('dividido').addEventListener('click', function(p_evt){            
            pressKeyEffect2(this);
            if(processOperation('/'))
                screen.setValue('');            
        });

        document.getElementById('menos').addEventListener('click', function(p_evt){  
            pressKeyEffect2(this);          
            if(processOperation('-'))
                screen.setValue('');
        });

        document.getElementById('mas').addEventListener('click', function(p_evt){
            pressKeyEffectPlus(this);
            if(processOperation('+'))
                screen.setValue('');
        });

        document.getElementById('igual').addEventListener('click', function(p_evt){
            pressKeyEffect1(this);
            processOperation('=');
        });

        document.getElementById('sign').addEventListener('click', function(p_evt){
            var w_number = 0;

            try{
                pressKeyEffect2(this);

                w_number = Number(screen.getValue());
                w_number = (-1) * w_number;
                screen.setValue(w_number);  
            }catch(p_err){
                processError(p_err);
            }
        });        

        document.getElementById('on').addEventListener('click', function(p_evt){
            try{
                pressKeyEffect2(this);                
                screen.clear();                
                input.clear();
            }catch(p_err){
                processError(p_err);
            }
        });

        document.getElementById('raiz').addEventListener('click', function(p_evt){
            var w_number = 0, w_result = 0;
            try{
                pressKeyEffect2(this);
                w_number = Number(screen.getValue());
                w_result = Math.sqrt(w_number);
                screen.setValue(w_result);
            }catch(p_err){
                processError(p_err);
            }
        });
    }

    return {
        init: init
    }    
}());

Calculator.init();