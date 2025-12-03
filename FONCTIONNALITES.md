# Fonctionnalités de l'application

Application : moncenip-toh2025  
Thème : gestion de héros et d’armes avec arène de combat et authentification sur le thème du Seigneur des Anneaux.

## Fonctionnalités principales

L’application permet à un utilisateur connecté de gérer une liste de héros et d’armes, puis de faire s’affronter ces héros dans une arène. Les données sont stockées dans une base distante et sont conservées entre les sessions.

## Gestion des héros

L’utilisateur peut consulter la liste des héros, en filtrer certains par nom et les trier selon différents critères.  
Chaque héros dispose d’un formulaire de création ou de modification avec nom et statistiques (attaque, esquive, dégâts, points de vie) ainsi qu’une arme équipée.  
Un système de validation limite le total de points disponibles et empêche les valeurs incohérentes. Une arme ne peut pas rendre un héros injouable et ne peut être équipée que par un seul héros à la fois.

## Gestion des armes

Une section dédiée permet de créer, modifier et supprimer des armes.  
Pour chaque arme, on configure un nom et quatre statistiques. Ces statistiques sont bornées et leur somme doit être nulle, ce qui garantit des armes globalement équilibrées.  
La liste des armes rappelle quels héros les utilisent, ce qui aide à mesurer leur impact sur l’équilibre général.

## Arène de combat

Une arène permet de sélectionner deux héros et de lancer une simulation de combat.  
La résolution du combat se fait tour par tour, en prenant en compte les statistiques totales des héros, armes incluses.  
Un journal de combat décrit les actions, les touches ou esquives, les dégâts infligés et le résultat final (victoire, défaite ou combat arrêté après un certain nombre de tours).

## Authentification et accès

L’accès au dashboard, aux listes et à l’arène est réservé aux utilisateurs authentifiés.  
L’utilisateur se connecte via un formulaire e-mail / mot de passe et peut créer un compte si nécessaire. Les erreurs classiques (identifiants invalides, mot de passe trop court, e-mail déjà utilisé) sont gérées avec des messages adaptés.  
La session est conservée au rechargement de la page. Un utilisateur non connecté qui tente d’accéder à une page protégée est redirigé vers la page de connexion, puis renvoyé vers la page souhaitée après identification. À l’inverse, un utilisateur déjà connecté qui ouvre la page de connexion est redirigé vers le dashboard.

## Messages et persistance

Un panneau de messages affiche les informations importantes liées aux actions de l’utilisateur (création, modification, suppression, erreurs de sauvegarde).  
Les données métiers sont stockées dans une base distante et rechargées à chaque visite, ce qui permet de retrouver l’état de l’application d’une session à l’autre.
