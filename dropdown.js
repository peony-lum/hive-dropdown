class DropDown extends HTMLElement {
    // Caller can pass in whether they want a multi-select or single-select dropdown
    static observedAttributes = ["options", "selecttype"];

    // Const Variables used throughout class
    static chevronLeft = 
            `<svg id="chevron-left" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6L9 12L15 18" stroke="#191970" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
    static chevronDown =
            `<svg id="chevron-down" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.293 9.293a1 1 0 0 1 1.414 0L12 14.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z" fill="#191970"/>
            </svg>`;
    static MULTI_SELECT_STR = 'multi-select';


    constructor() {
        super();
        this.innerHTML = 
            `<div class="dropdown">
                <p id="selectedItems" hidden></p>
                <div id="arrowSvg">
                    ${DropDown.chevronLeft}
                </div>
            </div>
            <div id="optionList" hidden>
            </div>`;
        
        this.querySelector('.dropdown').addEventListener('click', () => this.toggleDropdown());
        this.dropDownOptions = [];
        this.selectedOptions = [];
        this.collapsed = true;
        this.selectType = '';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'options') {
            this.dropDownOptions = ['None', ...newValue.split(',').map(option => option.trim())];
        }

        if(name === 'selecttype') {
            this.selectType = newValue;

            // Since Select All should only be for multi-select, display options after selecttype is set
            if(newValue === DropDown.MULTI_SELECT_STR) {
                this.dropDownOptions = ['Select All', ...this.dropDownOptions];
            }

            this.displayOptions();
        }
    }

    // Controls whether menu is open or collapsed
    toggleDropdown() {
        let arrowDiv = this.querySelector('#arrowSvg');
        let optionList = this.querySelector('#optionList');

        this.collapsed = !this.collapsed;
        arrowDiv.innerHTML = this.collapsed ? `${DropDown.chevronLeft}` : `${DropDown.chevronDown}`;
        optionList.style.display = this.collapsed ? '' : 'flex';

        let selectedItems = this.querySelector('#selectedItems');
        selectedItems.innerHTML = this.selectedOptions.join(', ');
        selectedItems.style.display = 'block';
    }

    // Clean the option string, as callers can enter in weird characters or spacing
    sanitizeOption(option) {
        return option.trim().replace(/[\/\s]/g, '-');
    }

    // Dynamically add in options passed in
    displayOptions() {
        let optionList = this.querySelector('#optionList');

        this.dropDownOptions.map(option => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('optionButton');
            optionButton.id = this.sanitizeOption(option);
            optionButton.addEventListener('click', () => this.handleSelect(option));
            optionButton.appendChild(document.createTextNode(option));
            optionList.appendChild(optionButton);
        });
    }

    // Decides what to display in the menu/actions for when a user clicks on an option
    handleSelect(option) {
        const sanitizedOption = this.sanitizeOption(option);
        let currOption = this.querySelector(`#${sanitizedOption}`);

        // When dropdown is a multi-select
        if(this.selectType === DropDown.MULTI_SELECT_STR) {
            // Since none is essentially clearing everything, you can never have it multi-selected
            if(this.selectedOptions.includes('None') && option !== 'None') {
                let noneIndex = this.selectedOptions.indexOf('None');
                this.selectedOptions.splice(noneIndex, 1);
                this.querySelector('#None').style.backgroundColor = 'white';
            }

            switch (option) {
                // When select all option is already chosen, deselect everything (kind of like toggle)
                case 'Select All':
                    if(currOption.style.backgroundColor === 'cornflowerblue') {
                        this.selectedOptions = [];
                        this.dropDownOptions.map(item => {
                            let sanitizedItem = this.sanitizeOption(item);
                            this.querySelector(`#${sanitizedItem}`).style.backgroundColor = 'white';
                        });
                    } else {
                        this.dropDownOptions.map(item => {
                            // do not add in none option
                            if(item !== 'None') {
                                // do not add in select all or repeatedly add options
                                if(item !== 'Select All' && !this.selectedOptions.includes(item)) {
                                    this.selectedOptions.push(item);
                                }
                                let sanitizedItem = this.sanitizeOption(item);
                                this.querySelector(`#${sanitizedItem}`).style.backgroundColor = 'cornflowerblue';
                            }
                        });
                    }
                    break;
                case 'None':
                    // none is already selected, deselect this option
                    if(this.selectedOptions.includes('None')) {
                        this.selectedOptions = [];
                        this.querySelector('#None').style.backgroundColor = 'white';
                    } else {
                        // none is not currently selected, clear all choices that were selected
                        this.selectedOptions = ['None'];
                        this.dropDownOptions.map(item => {
                            let sanitizedItem = this.sanitizeOption(item);
                            if(item !== 'None') {
                                this.querySelector(`#${sanitizedItem}`).style.backgroundColor = 'white';
                            } else {
                                this.querySelector(`#${sanitizedItem}`).style.backgroundColor = 'cornflowerblue';
                            }
                        });
                    }
                    break;
                default:
                    /* if select all is selected, be sure to deselect, as this will no longer be the case
                    that everything is selected */
                    if(this.querySelector('#Select-All').style.backgroundColor === 'cornflowerblue') {
                        this.querySelector('#Select-All').style.backgroundColor = 'white';
                    }
                    // selected option is already selected, deselect option (toggle)
                    if(!this.selectedOptions.includes(option)) {
                        this.selectedOptions.push(option);
                        currOption.style.backgroundColor = 'cornflowerblue';
                    } else {
                        // selected option is not selected, add it into selected options array
                        let optionIndex = this.selectedOptions.indexOf(option);
                        this.selectedOptions.splice(optionIndex, 1);
                        currOption.style.backgroundColor = 'white';
                    }
                    break;
            }
        } 
        // single select dropdown
        else {
            // selected options array can only hold one item at a time
            let selectedOption = this.selectedOptions.pop();

            // if option is not the current selection, then add it in to selected options array
            if(!selectedOption || selectedOption !== option) {
                this.selectedOptions.push(option);
                currOption.style.backgroundColor = 'cornflowerblue';
            }

            // deselect previous option
            if(selectedOption) {
                let sanitizedOption = this.sanitizeOption(selectedOption);
                this.querySelector(`#${sanitizedOption}`).style.backgroundColor = 'white';
            }
        }
    }

}

customElements.define('drop-down', DropDown);