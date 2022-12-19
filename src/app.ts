//autobind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const orgMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = orgMethod.bind(this);
      return boundFunction;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;

  //inputs
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.formEl = importedNode.firstElementChild as HTMLFormElement;
    this.formEl.id = "user-input";

    //inputs
    this.titleInputEl = this.formEl.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.descInputEl = this.formEl.querySelector(
      "#description"
    )! as HTMLInputElement;

    this.peopleInputEl = this.formEl.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.anexar();
  }

  // é necessário colocar uma possibilidade de retorno vazio, pois, caso o usuário digite um campo errado, ele irá receber um retorno vazio juntamente com o erro
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDesc = this.descInputEl.value;
    const enteredPeople = this.peopleInputEl.value;
    //validation
    if (
      enteredTitle.trim().length === 0 ||
      enteredDesc.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Todos os campos são obrigatórios.");
      return;
    } else {
      return [enteredTitle, enteredDesc, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.formEl.addEventListener("submit", this.submitHandler.bind(this));
  }

  private anexar() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

const projectInput = new ProjectInput();
