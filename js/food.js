var basePrefixes = "" +
    'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
    'PREFIX dbr: <http://dbpedia.org/resource/> ' +
    'PREFIX dbp: <http://dbpedia.org/property/> ' +
    'PREFIX dbdt: <http://dbpedia.org/datatype/> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ';

/*
STRUCTURE DU RESULTAT : 
generalInformations 
    {
        + label
        + abstract
        ? alias 
        ? thumbnail
        + descendingTypes [
            + label
            + link
        ]
    }
composition 
    {
        ? betacaroteneUg
        ? calciumMg
        ? calories
        ? carbs
        ? fat
        ? fiber
        ? ironMg
        ? kj
        ? magnesiumMg
        ? phosphorusMg
        ? protein
        ? sodiumMg
        ? sugars
        ? vitaUg
        ? vitb6Mg
        ? vitcMg
        ? viteMg
        ? vitkUg
        ? water
        ? zincMg
    }
origin 
    {
        ? region (Jamais vue)
        + countries [
            + label
            ? link
        }
        + productors [
            + label
            + link
        ]
    }
usage 
    {
        ? servingSize
        ? servingTemperature
        + receipes [
            + label
            + link
        ]
        + ingredients [
            + label
            + link
        ]
    }
categories [
    + label
    + link
]
*/

/**
 * findFoodInformations
 * Retourne l'ensemble des informations sur le produit (en tant que nourriture)
 * @param {String} uri URI du produit en question 
 * @param {function(JsonObject)} onResult fonction appelée lorsque le résultat est trouvé 
 */
function findFoodInformations(uri, onResult) {
    var count = 0;
    var totalCount = 5;
    var finalResult = {};

    findGeneralInformations(uri, function(result) {
        count += 1;
        finalResult.generalInformations = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findComposition(uri, function(result) {
        count += 1;
        finalResult.composition = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findOrigin(uri, function(result) {
        count += 1;
        finalResult.origin = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findUsage(uri, function(result) {
        count += 1;
        finalResult.usage = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });

    findCategories(uri, function(result) {
        count += 1;
        finalResult.categories = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });
}

/**
 * findGeneralInformations
 * Trouve les informations générales sur le produits
 *  {
 *      + label
 *      + abstract
 *      ? alias 
 *      ? thumbnail
 *      + descendingTypes [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé à la fin de la requete.
 */
function findGeneralInformations(uri, onResult) {
    var queryBasics = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?alias ' +
        '?abstract ' +
        '?thumbnail ' +
        'WHERE { ' +
        '  <' + uri + '> rdfs:label ?label . ' +
        '  <' + uri + '> dbo:abstract ?abstract . ' +
        '  OPTIONAL { ' +
        '    <' + uri + '> dbo:thumbnail ?thumbnail . ' +
        '  } ' +
        '  OPTIONAL { ' +
        '    <' + uri + '> dbo:alias ?alias . ' +
        '    FILTER(lang(?alias) = "en") ' +
        '  } ' +
        '  FILTER(lang(?abstract) = "en" && lang(?label) = "en")' +
        '} ' +
        'LIMIT 1';

    var queryTypeOf = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?link ' +
        'WHERE { ' +
        '  ?link dbo:type <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'LIMIT 20';

    var finalResult = null;
    queryData(queryBasics, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        finalResult = result[0];
        if (finalResult == undefined) {
            finalResult = {};
        }
        queryData(queryTypeOf, function(result) {
            finalResult.descendingTypes = result;
            onResult(finalResult);
        });
    });
}

/**
 * findComposition
 * Trouve les informations sur la composition / les valeurs nutritives
 * {
 *      ? betacaroteneUg
 *      ? ... (voir sur docs)
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé à la fin de la requete.
 */
function findComposition(uri, onResult) {
    var queryCompposition = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  OPTIONAL { <' + uri + '> dbp:betacaroteneUg ?betacaroteneUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:calciumMg ?calciumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:calories ?calories . }' +
        '  OPTIONAL { <' + uri + '> dbp:carbs ?carbs . }' +
        '  OPTIONAL { <' + uri + '> dbp:fat ?fat . }' +
        '  OPTIONAL { <' + uri + '> dbp:fiber ?fiber . }' +
        '  OPTIONAL { <' + uri + '> dbp:ironMg ?ironMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:kj ?kj . }' +
        '  OPTIONAL { <' + uri + '> dbp:magnesiumMg ?magnesiumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:phosphorusMg ?phosphorusMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:sodiumMg ?sodiumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:sugars ?sugars . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitaUg ?vitaUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitb6Mg ?vitb6Mg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitcMg ?vitcMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:viteMg ?viteMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitkUg ?vitkUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:water ?water . }' +
        '  OPTIONAL { <' + uri + '> dbp:zincMg ?zincMg . }' +
        '} ' +
        'LIMIT 1';

    queryData(queryCompposition, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        onResult(result[0]);
    })
}

/**
 * findOrigin
 * Trouve les informations sur l'origine du prodtui
 * {
 *      ? region {
 *          + label
 *          + link
 *      }
 *      + countries [
 *          + label
 *          ? link
 *      }
 *      + productors [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelée à l'arrivée du resultat 
 */
function findOrigin(uri, onResult) {

    var queryRegion = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  <' + uri + '> dbo:region ?link . ' +
        '  ?link rdfs:label ?label ' +
        '  FILTER(lang(?label) = "en") ' +
        '} ' +
        'LIMIT 1';


    var queryCountries = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        ' { ' +
        '  <' + uri + '> dbo:country ?link . ' +
        '  ?link rdfs:label ?label ' +
        '  FILTER(lang(?label) = "en") ' +
        ' } UNION { ' +
        '  <' + uri + '> dbp:country ?label ' +
        ' } ' +
        '} ' +
        'LIMIT 50';


    var queryProductors = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  ?link dbo:product <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en") ' +
        '} ' +
        'LIMIT 50';

    var finalResult = {};
    queryData(queryRegion, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        if (result != undefined && result[0] != undefined) {
            finalResult.region = result[0];
        }
        queryData(queryCountries, function(result) {
            finalResult.countries = result;

            queryData(queryProductors, function(result) {
                finalResult.productors = result;
                onResult(finalResult);
            });
        });
    });
}

/**
 * findUsage
 * Trouve les "usages" du produit
 * {
 *      ? servingSize
 *      ? servingTemperature
 *      + receipes [
 *          + label
 *          + link
 *      ]
 *      + ingredients [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelée à l'arrivée du resultat 
 */
function findUsage(uri, onResult) {
    var queryServingData = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  OPTIONAL { <' + uri + '> dbo:servingSize ?servingSize . } ' +
        '  OPTIONAL { <' + uri + '> dbo:servingTemperature ?servingTemperature . } ' +
        '} ' +
        'LIMIT 1';

    var finalResult = null;
    queryData(queryServingData, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        finalResult = result[0];
        if (finalResult == undefined) {
            finalResult = {};
        }
        findReceipes(uri, function(result) {
            finalResult.receipes = result;
            findIngredients(uri, function(result) {
                finalResult.ingredients = result;
                onResult(finalResult);
            });
        });
    });
}

/**
 * findReceipes
 * Trouve les recettes qui utilisent le produit
 * [
 *      + label
 *      + link
 * ]
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé au résultat 
 * @param {Integer} offset (Optionnel) Indice de la première recette à trouver (0 par défaut)
 * @param {Integer} limit (Optionnel) Nombre maximal de recettes à retourner (20 par défaut)
 */
function findReceipes(uri, onResult, offset = 0, limit = 20) {
    var queryReceipes = basePrefixes +
        'SELECT ' +
        ' * ' +

        'WHERE { ' +
        '  ?link dbo:ingredient <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT ' + limit;

    queryData(queryReceipes, onResult);

}

/**
 * findIngredients
 * Trouve les ingrédients du produit
 * [
 *      + label
 *      + link
 * ]
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé au résultat 
 * @param {Integer} offset (Optionnel) Indice du premier ingrédient à trouver (0 par défaut)
 * @param {Integer} limit (Optionnel) Nombre maximal d'ingrédients à retourner (20 par défaut)
 */
function findIngredients(uri, onResult, offset = 0, limit = 20) {
    var queryIngredients = basePrefixes +
        'SELECT ' +
        ' * ' +

        'WHERE { ' +
        '  <' + uri + '> dbo:ingredient  ?link . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT ' + limit;

    queryData(queryIngredients, onResult);
}

/**
 * findCategories
 * Trouve les catégories liées à l'objet
 *  [
 *      + link
 *      + label
 *  ]
 * @param {String} uri URI de l'objet en question
 * @param {function(String)} onResult function(String) fonction appelée au résultat de la requête
 * @param {Integer} offset offest, utilisé pour la navigation en page 
 * @param {Integer} limit limite en nombre de résultat 
 */
function findCategories(uri, onResult, offset = 0, limit = 10) {
    var queryCategories = basePrefixes +
        'SELECT ' +
        ' * ' +

        'WHERE { ' +
        '  <' + uri + '> <http://purl.org/dc/terms/subject>  ?link . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT ' + limit;

    queryData(queryCategories, onResult);
}

/**
 * From a link, extract the part after the last "/", used to store only the resource Name in 
 * uri "dbpedia.org/resource"
 * @param {String} link the link to extract the resource from
 */
function extractResourceName(link) {
    return link.substring(link.lastIndexOf("/") + 1);
}

/**
 * From a link, extract the part after the last ":", used to store only the category Name in 
 * uri "dbpedia.org/resource/Category:"
 * @param {String} link the link to extract the resource from
 */
function extractCategoryName(link) {
    return link.substring(link.lastIndexOf(":") + 1);
}

/**
 * Populate the IHM from the values queried
 * @param {JsonObject} values json informations queried about the data 
 */
function populatePage(values) {
    console.log(values);
    // 
    try {
        document.title = values.generalInformations.label.value;
    } catch (e) {
        console.log(e);
        document.title = "Error";
        document.querySelector("h1").innerText = "Error :" + data;
        document.querySelector("#description").innerText = "Il n'y a aucune informations sur cette page"
        document.querySelector("#types_title").innerText = "";
        document.querySelector("#receipes_list").innerText = "Aucune donnée trouvée";
        document.querySelector("#ingredients_list").innerText = "Aucune donnée trouvée";
        document.querySelector("#countries_list").innerText = "Aucune donnée trouvée";
        document.querySelector("#productors_list").innerText = "Aucune donnée trouvée";
        document.querySelector("#composition").innerText = "Aucune donnée trouvée";
        document.querySelector("#thumbnail").src = "images/erreur.jpg";
        return;
    }


    var titleStr = values.generalInformations.label.value;
    document.querySelector("h1").innerText = titleStr;

    if (values.generalInformations.alias != undefined) {
        document.querySelector("#alias").innerText = "(Or " + values.generalInformations.alias.value + ")   ";
    }

    // Image (thumbnail)
    if (values.generalInformations.thumbnail != undefined)
        document.querySelector("#thumbnail").src = values.generalInformations.thumbnail.value;
    else
        document.querySelector("#thumbnail").src = "images/erreur.jpg";


    // Description (abstract)
    document.querySelector("#description").innerText = values.generalInformations.abstract.value.trim();

    // List of types
    typeList = document.querySelector("#types_list");
    var empty = true;
    for (var i = 0; i < values.generalInformations.descendingTypes.length; i++) {
        var type = values.generalInformations.descendingTypes[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(type.link.value);
        link.textContent = type.label.value;
        el.appendChild(link);
        typeList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#types_title").innerText = "";
    }

    // Composition
    compoList = document.querySelector("#composition");
    var empty = true;
    for (var compoType in values.composition) {
        if (compoType != undefined) {
            var el = document.createElement("li");
            console.log(compoType);
            var comp = compoType + ": " + values.composition[compoType].value;
            el.innerText = comp;
            compoList.appendChild(el);
            empty = false;
        }
    }
    if (empty) {
        document.querySelector("#composition").innerText = "Aucune donnée trouvée";
    }

    // Origin 
    // Region
    var region = values.origin.region;
    if (region != undefined) {
        var el = document.querySelector("#region");
        el.innerText = "Region : ";
        var link = document.createElement("a");
        //link.href = region.link.value;
        link.textContent = region.label.value;
        el.appendChild(link);
    }

    // Countries
    countriesList = document.querySelector("#countries_list");
    empty = true;
    for (var i = 0; i < values.origin.countries.length; i++) {
        var country = values.origin.countries[i];
        var el = document.createElement("li");
        if (country.link != undefined) {
            var link = document.createElement("a");
            // TODO page for a contry -- 
            // link.href = "./food.html?data=" + extractResourceName(country.link.value);
            link.textContent = country.label.value;
            el.appendChild(link);
        } else {
            el.textContent = country.label.value;
        }
        countriesList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#countries_list").innerText = "Aucune donnée trouvée";
    }

    // Productors
    productorsList = document.querySelector("#productors_list");
    empty = true;
    for (var i = 0; i < values.origin.productors.length; i++) {
        var productor = values.origin.productors[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        // TODO page for a productor -- 
        // link.href = "./food.html?data=" + extractResourceName(productor.link.value);
        link.textContent = productor.label.value;
        el.appendChild(link);
        productorsList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#productors_list").innerText = "Aucune donnée trouvée";
    }

    // Usage
    // Serving info
    var servingInfo = "";
    var servingSize = values.usage.servingSize;
    if (servingSize != undefined) {
        servingInfo += "Serving size : " + servingSize.value + "g\n";
    }
    var servingTemperature = values.usage.servingTemperature;
    if (servingTemperature != undefined) {
        servingInfo += "Serving temperature : " + servingTemperature.value;
    }
    if (servingInfo != "") {
        document.querySelector("#serving").innerText = servingInfo.trim();
    }

    // Receipes
    receipesList = document.querySelector("#receipes_list");
    emptyReceipes = true;
    for (var i = 0; i < values.usage.receipes.length; i++) {
        var receipe = values.usage.receipes[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(receipe.link.value);
        link.textContent = receipe.label.value;
        el.appendChild(link);
        receipesList.appendChild(el);
        emptyReceipes = false;
    }


    // Ingredients
    ingredientsList = document.querySelector("#ingredients_list");
    emptyIngredients = true;
    for (var i = 0; i < values.usage.ingredients.length; i++) {
        var ingredient = values.usage.ingredients[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(ingredient.link.value);
        link.textContent = ingredient.label.value;
        el.appendChild(link);
        ingredientsList.appendChild(el);
        emptyIngredients = false;
    }
    if (emptyReceipes && emptyIngredients) {
        document.querySelector("#receipes_list").innerText = "Aucune donnée trouvée";
        document.querySelector("#ingredients_list").innerText = "Aucune donnée trouvée";
    } else {
        if (emptyReceipes) {
            document.querySelector("#receipes_title").innerText = "";
        }
        if (emptyIngredients) {
            document.querySelector("#ingredients_title").innerText = "";
        }
    }

    // Categories
    categoriesList = document.querySelector("#categories_list");
    empty = true;
    for (var i = 0; i < values.categories.length; i++) {
        var category = values.categories[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        // TODO page for a productor -- 
        link.href = "./categories.html?data=" + extractCategoryName(category.link.value);
        link.textContent = category.label.value;
        el.appendChild(link);
        categoriesList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#categories_list").innerText = "Aucune donnée trouvée";
    }
}

/**
 * A starting : get the data to query and query its informations 
 */
var data = new URL(document.location.href).searchParams.get("data");

var uri = 'http://dbpedia.org/resource/' + data;

findFoodInformations(uri, populatePage);