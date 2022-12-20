import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { baseComponent } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
// project item at list
export class ProjectItem
  extends baseComponent<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 pessoa atribuída";
    } else {
      return `${this.project.people} pessoas atribuídas`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  @autobind
  dragStart(event: DragEvent) {
    // utilizado para anexar informações a serem arrastadas
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEnd(_: DragEvent) {
    console.log("fim");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStart);
    this.element.addEventListener("dragend", this.dragEnd);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
