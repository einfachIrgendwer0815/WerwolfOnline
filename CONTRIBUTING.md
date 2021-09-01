# How to conrtibute to this repository?

At first, contributing is highly appreciated and everyone is welcome to do this. But please stick to the following rules and conventions.

## General speech

1. No racist, sexist, vulgar, obscene or insulting statements.

2. Write at least in english. You are allowed to use other languages as long as you provide the same text in english (in form and content).

## Issues

Please follow the respective templates for bug reports and feature requests. Do *not* use issues to ask questions.

## Pull request

### Commit titles and descriptions

Every commit message should stick to the following pattern:

```
<main category> - <sub category> | <Short description>  
*2 blank lines*
<long description if necessary>
```

The available main categories are: webpage, backend and docs.
Sub categories aren`t that strict, but should be some kind of logic. There might be multiple - comma separated - sub categories.
Examples:  
```
webpage - app
# the overall app-component and their child-components

webpage - index
# the main directory of the angular project
```

You should structure your commits in a way, that you don't need multiple main categories in a single commit.

### Pull request description

Please always check if your pull request would fix an existing issue. If it does, just mention the issue in a comment and that your change fixes it and everything is fine.

Otherways:

1. Describe why the pull request is needed and/or helpful.

2. Describe what the code you added or modified does. Explain the behaviour of cryptic-looking parts in the code.

3. And - in case of modification - why the code you created is better to use.
