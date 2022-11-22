import { Component, OnInit } from '@angular/core';
import { CommandDto } from '../models/interface';
import { CommandService } from '../services/commandes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})

export class ApiComponent implements OnInit {
  array: CommandDto[] = new Array<CommandDto>();

  commandFormGroup: FormGroup = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    price: new FormControl<number>(+'', [
      Validators.required,
      Validators.pattern('[0-9]*'),
    ])
  });

  get name() {
    return this.commandFormGroup.get('name');
  }

  get price() {
    return this.commandFormGroup.get('price');
  }

  addOrPut = false;

  constructor(private commandService:CommandService) { }

  ngOnInit(): void {
    this.getCommand();
  }

  getCommand() {
    this.commandService.getAll()
    .subscribe((data: CommandDto[]) =>{
      this.array = data;
    })
  }

  deleteCommand(id: any){
    this.commandService.delete(id).subscribe(
      () => {this.array = this.array.filter( (aCommand) => aCommand.id != id)
      })
  }

  postCommand(){
    this.commandService.post(this.commandFormGroup.value)
    /*
      this.commandFormGroup.value is equivalent to:
      {
        name,
        price
      }
    */
    .subscribe(
      (eachCommand: any)=>{
          this.array = [eachCommand, ...this.array];
          this.clearInputs();
    })

  }

  // make inputs empty
  clearInputs(){
    this.commandFormGroup.reset;
    // or
    // this.commandFormGroup.get('name')?.setValue('');
    // this.commandFormGroup.get('price')?.setValue('');
  }

  // edit commandService
  editCommand(eachCommand: CommandDto){
    this.commandFormGroup.get('name')?.setValue(eachCommand.name);
    this.commandFormGroup.get('price')?.setValue(eachCommand.price);
    this.addOrPut=true;
  }

  // update commandService
  putCommand(){
    this.commandService.updateCommand(this.commandFormGroup.value)
    .subscribe( () => {
      this.clearInputs();
      this.addOrPut = false;
    })
  }
}
