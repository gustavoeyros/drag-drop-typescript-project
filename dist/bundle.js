var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.baseComponent = void 0;
    class baseComponent {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateEl = document.getElementById(templateId);
            this.hostEl = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateEl.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostEl.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        }
    }
    exports.baseComponent = baseComponent;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
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
    exports.validate = validate;
});
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autobind = void 0;
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
    exports.autobind = autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFunction) {
            this.listeners.push(listenerFunction);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, numOfPeople) {
            const newProject = new project_1.Project(Math.random().toString(), title, description, numOfPeople, project_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((prj) => prj.id === projectId);
            if (project && project.status != newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFunction of this.listeners) {
                listenerFunction(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("components/project-input", ["require", "exports", "components/base-component", "util/validation", "decorators/autobind", "state/project-state"], function (require, exports, base_component_js_1, validation_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_js_1.baseComponent {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputEl = this.element.querySelector("#title");
            this.descInputEl = this.element.querySelector("#description");
            this.peopleInputEl = this.element.querySelector("#people");
            this.configure();
        }
        configure() {
            this.element.addEventListener("submit", this.submitHandler.bind(this));
        }
        renderContent() { }
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
            if (!(0, validation_js_1.validate)(titleValidatable) ||
                !(0, validation_js_1.validate)(descValidatable) ||
                !(0, validation_js_1.validate)(peopleValidatable)) {
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
                project_state_js_1.projectState === null || project_state_js_1.projectState === void 0 ? void 0 : project_state_js_1.projectState.addProject(title, desc, people);
                this.clearInputs();
            }
        }
    }
    __decorate([
        autobind_js_1.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base-component", "decorators/autobind"], function (require, exports, base_component_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_js_2.baseComponent {
        get persons() {
            if (this.project.people === 1) {
                return "1 pessoa atribuída";
            }
            else {
                return `${this.project.people} pessoas atribuídas`;
            }
        }
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStart(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEnd(_) {
            console.log("fim");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStart);
            this.element.addEventListener("dragend", this.dragEnd);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent = this.persons;
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        autobind_js_2.autobind
    ], ProjectItem.prototype, "dragStart", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "models/project", "components/base-component", "decorators/autobind", "state/project-state", "components/project-item"], function (require, exports, project_js_1, base_component_js_3, autobind_js_3, project_state_js_2, project_item_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_js_3.baseComponent {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
                event.preventDefault();
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData("text/plain");
            project_state_js_2.projectState.moveProject(projectId, this.type === "ativos" ? project_js_1.ProjectStatus.Active : project_js_1.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                "PROJETOS " + this.type.toUpperCase();
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            project_state_js_2.projectState === null || project_state_js_2.projectState === void 0 ? void 0 : project_state_js_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter((prj) => {
                    if (this.type === "ativos") {
                        return prj.status === project_js_1.ProjectStatus.Active;
                    }
                    return prj.status === project_js_1.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = "";
            for (const projectItems of this.assignedProjects) {
                new project_item_js_1.ProjectItem(this.element.querySelector("ul").id, projectItems);
            }
        }
    }
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_1, project_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const projectInput = new project_input_1.ProjectInput();
    const activeProjectList = new project_list_1.ProjectList("ativos");
    const finishedProjectList = new project_list_1.ProjectList("finalizados");
});
