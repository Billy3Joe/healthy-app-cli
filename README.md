# Healthy App

Healthy App est une application mobile développée avec React Native qui permet aux utilisateurs de partager et de découvrir des recettes saines. Cette application offre une plateforme conviviale pour encourager des habitudes alimentaires positives.
Configuration du Projet
Prérequis

    Node.js et npm installés sur votre machine
    Accès à un émulateur Android ou un appareil Android connecté via USB (pour l'exécution sur Android)
    Xcode installé sur votre machine (pour l'exécution sur iOS)

## Étape 1: Installation des Dépendances

    Clonez le dépôt du projet :

    bash

git clone https://github.com/Billy3Joe/healthy-app-cli.git

Accédez au répertoire du projet :

bash

cd healthy-app-cli

Installez les dépendances du projet :

bash

    npm install

## Étape 2: Configuration de Firebase

    Créez un projet Firebase sur Firebase Console.
    Ajoutez votre application à votre projet Firebase et téléchargez le fichier de configuration (google-services.json pour Android).
    Placez le fichier de configuration dans le répertoire approprié de votre projet React Native (android/app pour Android).

## Étape 3: Exécution du Projet
Sur Android

    Lancez un émulateur Android ou connectez un appareil Android via USB à votre machine.
    Exécutez la commande suivante pour lancer l'application sur votre appareil ou émulateur Android :

    bash

    npx react-native run-android







This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
