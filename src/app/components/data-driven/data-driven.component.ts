import { ValidatorsService } from './../../services/validators.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.css']
})
export class DataDrivenComponent implements OnInit {

  myForm: FormGroup;
  myFormList: FormGroup; 

  states = [
    {nome: 'São Paulo', sigla: 'SP'},
    {nome: 'Rio de Janeiro', sigla: 'RJ'},
    {nome: 'Pernambuco', sigla: 'PE'},
    {nome: 'Alagoas', sigla: 'AL'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private validatorService: ValidatorsService
  ) { }

  setState(){
    const myState =  {nome: 'Rio de Janeiro', sigla: 'RJ'};
    this.myForm.get('endereco.uf').setValue(myState); 
  }

  compareStates(obj1, obj2){
    if(obj1 && obj2){
      return obj1.sigla === obj2.sigla;
    }
    return false;
  }

  onSubmit(){
    console.log(this.myForm);
    console.log(this.myFormList);
    console.log(this.fruits);
  }

  ngOnInit(): void {
/*     this.myForm = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */

    const fb = this.formBuilder;
    
    this.myFormList = fb.group({
      fruits: fb.array([this.createFruit()])
    });

    this.myForm = fb.group({
      informacoes: fb.group({
        nome: [null, [Validators.required, Validators.minLength(4), 
          this.validatorService.nameValidaton],
          [this.validatorService.userValidation.bind(this.validatorService)] ],
        idade: [null],
        email: [null, [Validators.required, Validators.email] ],
        confirmaEmail: [null, [Validators.email] ],
        empregado: [null, [Validators.pattern('true')] ],
        sexo: ['M']
      }),
      endereco: fb.group({
        cep: [null],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        localidade: [null],
        uf: [null]
      })
    });

    this.myForm.get('informacoes.nome').valueChanges.subscribe(
      value => {
        console.log(value);
      }
    )
  }

  get fruits(){
    return this.myFormList ? this.myFormList.get('fruits') as FormArray:null;
  }

  getAddress(){
    this.httpClient.get(`http://viacep.com.br/ws/${this.myForm.get('endereco.cep').value}/json`)
      .subscribe(
        endereco => {
          this.myForm.patchValue({endereco});
        }
      )
  }

  addFruit(){
    this.fruits.push(this.createFruit());
  }

  removeFruit(index){
    this.fruits.removeAt(index);
  }

  createFruit(){
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      price: [null, [Validators.required]] 
    });
  }

}
