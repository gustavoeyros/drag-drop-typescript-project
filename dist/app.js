"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}
function autobind(_, _2, descriptor) {
    const orgMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFunction = orgMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateEl = document.getElementById("project-list");
        this.hostEl = document.getElementById("app");
        this.assignedProjects = [];
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState === null || projectState === void 0 ? void 0 : projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        for (const projectItems of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItems.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    attach() {
        this.hostEl.insertAdjacentElement("beforeend", this.element);
    }
}
class ProjectInput {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.hostEl = document.getElementById("app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.formEl = importedNode.firstElementChild;
        this.formEl.id = "user-input";
        this.titleInputEl = this.formEl.querySelector("#title");
        this.descInputEl = this.formEl.querySelector("#description");
        this.peopleInputEl = this.formEl.querySelector("#people");
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputEl.value;
        const enteredDesc = this.descInputEl.value;
        const enteredPeople = this.peopleInputEl.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descValidatable = {
            value: enteredDesc,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descValidatable) ||
            !validate(peopleValidatable)) {
            alert("Valor inválido! Tente novamente.");
            return;
        }
        else {
            return [enteredTitle, enteredDesc, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descInputEl.value = "";
        this.peopleInputEl.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            projectState === null || projectState === void 0 ? void 0 : projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.formEl.addEventListener("submit", this.submitHandler.bind(this));
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
