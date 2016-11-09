## Contributing to ingress-ice

Thanks for taking the time to contribute! :heart:

If you want to contribute, do the following:
 1. Fork the repo (https://github.com/nibogd/ingress-ice)
 2. Create a new branch named with the name of the feature you want to add, based on the `master` branch
 3. Add your code
 4. Make a pull-request

If your submission is accepted, I will list you in the `README.md` file as a contributor.

### Directory structure

```
├── CONTRIBUTING.md
├── Dockerfile
├── docker-ingress-ice.sh
├── ice
│   ├── ice.js
│   ├── ingress-ice.conf.sample
│   └── modules
│       ├── ice-10-utils.js
│       ├── ice-20-aws.js
│       ├── ice-20-dropbox.js
│       ├── ice-30-config.js
│       ├── ice-40-setminmax.js
│       └── ...
├── ingress-ice.sh
├── ingress-ice.cmd
├── LICENSE
├── phantom-bin
│   ├── phantomjs
│   ├── phantomjs64
│   ├── phantomjs-armv6l
│   ├── phantomjs.exe
│   └── phantomjs-osx
├── README.md
└── reconfigure.cmd

```

The root folder contains starting scripts. The main scripts are in the `ice` folder. All modules from the `ice/modules` folder are loaded automatically, so you don't need to edit the `ice.js` file.

In most cases, you create a file named `ice-[loadingOrderNumber]-your-feature-name.js` in the `ice/modules` folder and write all code there. That file should have a header like this (taken from `ice-20-aws.js`):

```
/**
* @file Ingress-ICE, Amazon S3 interface
* @license MIT
* @author c2nprds
*/
```

If the feature needs some functions to be called from the algorithm, edit the `ice/modules/ice-features-main.js` file. Main algorithms are located there.

### Documentation

I appreciate if you properly document your code using [JSDoc](http://usejsdoc.org/), but if you don't have time to do that or have other reasons not to document, and it is easy to understand, leave that to me — undocumented code is better than no code at all.

You can also build documentation for yourself by running the following in the root folder:
```
$ npm install jsdoc
$ jsdoc ice/ ice/modules/
```

### Workflow

We use [Feature Branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) workflow. Simply create a feature branch, it will be merged with `master` once.
