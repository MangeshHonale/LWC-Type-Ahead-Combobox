import { LightningElement, api, track } from "lwc";

const DEFAULT_MIN_SEARCH_CHARS = 1;

export default class TypeAheadCombobox extends LightningElement {
    @api label = "Search";
    @api placeholder = "Type to search...";
    @api noResultsLabel = "No matches found";
    @api disabled = false;
    @api required = false;
    @api minSearchChars = DEFAULT_MIN_SEARCH_CHARS;

    _options = [];
    @track searchTerm = "";
    @track isDropdownOpen = false;
    @track activeIndex = -1;

    @api
    get options() {
        return this._options;
    }

    set options(value) {
        const normalized = Array.isArray(value) ? value : [];
        this._options = normalized
            .filter((item) => item && typeof item.value !== "undefined" && typeof item.label === "string")
            .map((item) => ({
                label: item.label,
                value: item.value
            }));
    }

    get normalizedMinSearchChars() {
        const parsed = Number(this.minSearchChars);
        return Number.isNaN(parsed) || parsed < 0 ? DEFAULT_MIN_SEARCH_CHARS : parsed;
    }

    get comboboxClass() {
        return `slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ${
            this.isDropdownOpen ? "slds-is-open" : ""
        }`;
    }

    get activeDescendant() {
        return this.activeIndex >= 0 ? `typeahead-option-${this.activeIndex}` : null;
    }

    get filteredOptions() {
        const term = this.searchTerm.trim().toLowerCase();
        const hasEnoughChars = term.length >= this.normalizedMinSearchChars;
        const baseOptions = hasEnoughChars
            ? this._options.filter((option) => option.label.toLowerCase().includes(term))
            : this._options;

        return baseOptions.map((option, index) => ({
            ...option,
            index,
            id: `typeahead-option-${index}`,
            isActive: this.activeIndex === index,
            className: `slds-listbox__item ${this.activeIndex === index ? "slds-has-focus" : ""}`
        }));
    }

    handleInput(event) {
        this.searchTerm = event.target.value;
        this.activeIndex = -1;
        this.isDropdownOpen = true;
    }

    handleFocus() {
        if (!this.disabled) {
            this.isDropdownOpen = true;
        }
    }

    handleFocusOut() {
        // Delay close so option mousedown can run first.
        window.clearTimeout(this._blurTimeout);
        this._blurTimeout = window.setTimeout(() => {
            this.isDropdownOpen = false;
            this.activeIndex = -1;
        }, 120);
    }

    handleKeyDown(event) {
        if (!this.isDropdownOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            this.isDropdownOpen = true;
        }

        const optionCount = this.filteredOptions.length;
        if (!optionCount) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            this.activeIndex = this.activeIndex < optionCount - 1 ? this.activeIndex + 1 : 0;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : optionCount - 1;
        } else if (event.key === "Enter") {
            if (this.activeIndex >= 0) {
                event.preventDefault();
                this.selectOption(this.filteredOptions[this.activeIndex]);
            }
        } else if (event.key === "Escape") {
            this.isDropdownOpen = false;
            this.activeIndex = -1;
        }
    }

    handleOptionMouseDown(event) {
        const index = Number(event.currentTarget.dataset.index);
        const option = this.filteredOptions[index];
        if (option) {
            this.selectOption(option);
        }
    }

    selectOption(option) {
        this.searchTerm = option.label;
        this.isDropdownOpen = false;
        this.activeIndex = -1;

        this.dispatchEvent(
            new CustomEvent("select", {
                detail: {
                    label: option.label,
                    value: option.value
                }
            })
        );
    }
}
