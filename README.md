# LWC-Type-Ahead-Combobox

Reusable Lightning Web Component that provides a type-ahead search combobox with:
- Text filtering
- Keyboard navigation (Up/Down/Enter/Escape)
- Click selection
- `select` custom event payload with `label` and `value`

## Component

`force-app/main/default/lwc/typeAheadCombobox`

## Public API

- `label` (String)
- `placeholder` (String)
- `options` (Array<{ label: string; value: string }>)
- `noResultsLabel` (String)
- `disabled` (Boolean)
- `required` (Boolean)
- `minSearchChars` (Number, default `1`)

## Event

- `select`: `event.detail = { label, value }`

## Example Usage

```html
<c-type-ahead-combobox
    label="Account"
    placeholder="Search accounts..."
    options={accountOptions}
    onselect={handleAccountSelect}
></c-type-ahead-combobox>
```

```js
accountOptions = [
    { label: "Acme Corp", value: "001xx000003DHP0AAO" },
    { label: "Edge Communications", value: "001xx000003DHP1AAO" }
];

handleAccountSelect(event) {
    const { label, value } = event.detail;
    // use selected option
}
```