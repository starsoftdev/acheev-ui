## Branching

Branch naming: `taskType/taskName`, example: `feature/add-image-to-page`, or `bug/remove-error-message`.

When task is complete, push to `origin branchName` and create a new pull request.

# Code style guide

## Styles

For organizing styles we use [BEM](https://webdesign.tutsplus.com/articles/an-introduction-to-the-bem-methodology--cms-19403) methodology but with the following distinctions:

- CamelCase notation for Blocks, Elements and Modifiers
- double dash (--) instead of underscode (_) for Modifiers

Note we still use dashed-notation for Foundation classes and [Atomic classes](#atomic-and-utility-classes).

### Components and CSS classes naming

Each component's name (name of constant of a functional component or name of Class) should match its location, for ex. `components/CreateReview/Card` should be named `CreateReviewCard`:

```
class CreateReviewCard extends ...
...or...
const CreateReviewCard = () => ...
```

There should be only one top-level className that matches the name of component in `styles.scss` file. In this case it should be `.createReviewCard`. This prevents from CSS classes clashes across the app.

We group sibling components like this:

```
components
|__ Advice
   |__ Question
   |__ Answer
```

This reduces the number of top-level components so that it is easier to find one. Components' names should match this hierarchy, so that the above components should be named `AdviceQuestion` and `AdviceAnswer` respectively.

### Atomic and utility classes

We have `styles/atomic.scss` for [atomic](https://css-tricks.com/lets-define-exactly-atomic-css/) classes. Use cases:

- We have to add one or several commonly used styles to an element (for example `margin-bottom` or `font-size`). In this case we can just add one or several atomic classes instead of creating a custom class. Make sure there's no such an atomic class already before adding a new one. But we don't use more than 3 atomic classes together, in this case it is better to create a custom class.
- We can use atomic classes together with custom ones in the following case: we already use a custom class for several elements and want to modify some of them. So instead of creating BEM modifiers we can just add an atomic class to some of them. For example if we have a number of identical elements, but some of them have different margins, we can use something like this:

```
<div className="block__element">...</div>
<div className="block__element mb-md">...</div>
```

Atomic classes overwrite other styles as `styles/atomic.scss` is included in the very bottom of CSS bundle. If your selector has higher [specificity](https://developer.mozilla.org/ru/docs/Web/CSS/Specificity) and atomic class doesn't overwrite it, this is a signal you have to refactor your component to have plain structure (according to BEM). If you can't do it (for example in the case you use a third-party component), just add `!important` to atomic class you want to overwrite with, this is absolutely normal in this case.

> Note there are a lot of utility (read "atomic") classes in Foundation such as [float](https://github.com/zurb/foundation-sites/blob/v6.3/docs/pages/float-classes.md), [grid](https://github.com/zurb/foundation-sites/blob/v6.3/docs/pages/grid.md), [visibility](https://github.com/zurb/foundation-sites/blob/v6.3/docs/pages/visibility.md), [typography helpers](https://github.com/zurb/foundation-sites/blob/v6.3/docs/pages/typography-helpers.md), etc. Basically all the styles in Foundation except Components are atomic as each of them performs one small function and can be easily combined like this:

```
<div className="medium-6 large-4 hide-for-small columns text-center">...</div>
```

> Make sure there's no such a utility in Foundation before adding a custom atomic class.

### Using Foundation components

#### Styles

If you want to add a component that uses styles of a Foundation component, let's say Card, you should move styles from `styles/components/_card.scss` to `components/Card/styles.scss`. Also remove import of this file in `styles/foundation.scss` so that other team members know it is already used somewhere (if its import is missing, it is already used, you should search in `components` directory). Also remove variables for this component in `styles/settings/_settings.scss`, those in the new Component's styles.scss will be the only soursce of thruth.

#### Javascript

Foundation's JS components are written in vanilla JS and are in most cases not compatible with React. If you want to use one, you should import it from `react-foundation-components`. You can find an example in `components/DropDown`. Don't forget to import appropriate stylesheet as described in the previous section.

# Javascript

## Containers vs components, pages

Components are encapsulated React components that are driven solely by props and don't talk to Redux. Same as “dumb components”. They should stay the same regardless of router, data fetching library, etc. This makes components easily reusable and testable.

Containers are React components that are aware of Redux, Router, etc. They are more coupled to the app. Same as “smart components”.

Pages are mostly containers but they can also be components, for example a simple text page like "Terms of service". The main idea of pages is to have a separate entry point for every route.

## Sagas

Sagas are files where we keep all constants, actions, reducers, selectors and redux-saga generator functions. It is very convenient to have all these related things in one place as they are senseless separately. This idea is inspired by [Ducks](https://github.com/erikras/ducks-modular-redux) architecture by Erik Rasmussen.

We use declarative-ish constants for actions like: `REGISTER_REQUESTED`, `REGISTER_SUCCEEDED` and so on. The first part in this case (REGISTER) is called `base` and the second is `verb`. To reduce the number of constants in every saga, we keep verbs in `container/constants`, import the needed ones and concatenate with bases declared in every saga.

Important notes:

- When declaring a route using `createRoute` helper function in `routes.js`, use a unique name (2nd argument) for every route as they act as keys in store object. Otherwise these keys will clash and you can issue bizarre bugs.
- Every saga should export generators array as default export and reducer as named export `reducer` (used later by `createRoute`).

## Testing strategy

1) Utils must be well-tested, this is a very strict requirement. All the methods/parameters util has must be tested as well as their combinations. Whenever you add/remove/modify functionality of a util, make sure you add/remove/modify tests. This is the easiest way to prevent a considerable amount of bugs.

2) Cover all the components with unit-tests. This helps to prevent some bugs, but bad news is most of bugs appear at the junction of containers and components (connection issues, API changes or bugs, modification of containers, etc.).

3) So when we cover all the components with unit tests and are sure they work properly given correct props, we can test how containers and components work together with the help of integration tests.

## Type checking with Flow

There's no way to check staged files for Flow errors at the moment as we do with eslint. So please make sure you don't have them manually. Just install Flow extension in the IDE you are using and you will have the errors highlighed.

If you are using VSCode, don't forget to add the following setting:
```
"flow.pathToFlow": "${workspaceRoot}/node_modules/.bin/flow"
```
so that it uses local `flow` package and not global.

Checking the whole project for Flow errors before committing is quite slow, but ideally we should do this (don't allow committing if there are any Flow errors in the project).

## Naming conventions

When creating files and folders, please adhere to existing naming conventions, for example lowercase for top-level folders inside `app`, capitalized camel-case for components, lowercase for images, etc. This prevents us from issues at case-insensitive OS's: at a Linux system file.js and File.js are two separate files, but at Windows and Mac there's no difference. While webpack notifies about such cases, there may be weird issues with git messing up these files.

Event handling props should use the following naming convention: `on{Event}` for props and `handle{Event}` for methods that handle these events. Example:

```
class ControlledInputExample extends React.Component {
  state = {
    value: '',
  }
  handleChange = ({ value }) => {
    this.setState({ value });
    this.props.onChange(value);
  }
  render() {
    return (
      <input onChange={this.handleChange} />
    )
  }
}
```

# Important notes

When you add/remove/edit routes, be sure to adjust `/server/middlewares/sitemap.js` file accordingly.

# Other notes

Our app is based on [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate) v3.5.0. Take a look at its [documentation](https://github.com/react-boilerplate/react-boilerplate#documentation), it is very good and covers most of tools and techniques used in the project.
