# Hive Frontend Challenge
Hi! Thank you for the challenge and thank you for taking a look at my code!

## Instructions
I decided to build out the dropdown component with vanilla Javascript, HTML, and CSS. My files are all located within the root directory.

### Viewing the Demo/Dropdown component
To view the final product, you can navigate to the dropdown.html file and there you should see two dropdown components. One being the multi select dropdown and one being the single select dropdown.
It should look something like this:
<img width="1552" alt="Screenshot 2025-04-03 at 3 40 45 AM" src="https://github.com/user-attachments/assets/13435f7d-e2d2-4192-8623-9e95180aca3d" />

The two dropdown components have options that I have already passed in (for the sake of demo), but feel free to alter the code within the dropdown.html file.

### Dropdown Component Props
The `options` prop/attribute takes in a comma separated string with all of the options that should be included within the dropdown menu.

The `selecttype` prop/attribute takes in a string of either "multi-select" to indicate a multi select dropdown, otherwise it will treat it as a single select dropdown.

When an option(s) is selected, it will show up in the dropdown bar when collapsed/closed.

## Room for Improvement/Potential Refactoring
If I had a bit more time, I would definitely refactor these parts of the component's code:
- Deselecting the option for "Select All" and "None"
    - Currently, since these two options do not get put into the `selectedOptions` array when a user selects them, I was unable to detect whether they had already been selected by checking the `selectedOptions` array. This makes it difficult to toggle between the selected and deselected color. Instead, I had to rely on the actual `backgroundColor` CSS property for these two options, which can be very inconvenient if you were to alter the selected and deselected state colors.
    - For a future improvement, I would either look into storing a state for each button that would be marked as `true` if selected, `false` if not selected and if the "Select All" or "None" options are selected it would just manipulate this state instead of directly depending on the background colors. Another option would be to somehow utilize the CSS selected state of the button.

- Clean up the structure of the code.
    - Currently, there are some parts of the `handleSelect()` function that are repetitive and could instead be put into a separate function and called upon from `handleSelect()`.

- Have options show up in the toggle bar during the select and have it show up in a static order.
    - Currently, options will only show up when the dropdown is collapsed and they will show up in the order they are selected (if multi-select), due to the nature of how I am appending them to the `selectedOptions` array, which is then directly being displayed within the collapsed toggle. However, this can create a lot of confusion for a user.
    - For a future improvement, I would display the options selected in real-time within the dropdown, when it is open and would display them in the order they are in for the actual options menu. This could be done by incorporating a custom comparator function with the built-in javascript `sort()` function.

---
That should be it, but please feel free to reach out to me if there is anything else I can help clarify. Thank you!
