//boxplots functions factory
var boxplots;

var algorithms = ['pmx1', 'pmx2', 'pmx3', 'pmx4', 'pmx5', 'pmx6'];
var selectedAlgorithm = '0';

function loadCSV(url){
    return new Promise(function(resolve, reject){
        d3.csv(url, function(data) {
            resolve(data);
        })
    })
}

function loadDatasetForAlgorithm(alg) {
    var infoData = Array(10).fill().map(function (_, i) { return loadCSV('dados/'+ alg + '/info'+ i +'.csv')});
    var iterationsData = Array(10).fill().map(function (_, i) { return loadCSV('dados/'+ alg + '/teste'+ i +'.csv')});

    return Promise.all([
        Promise.all(infoData),
        Promise.all(iterationsData)]
    ).then(function(data) {
        console.log(data);
        infoData = data[0];
        iterationsData = data[1];

        var dataset = Array(10).fill().map(function (_, testIndex) {
            var item = {};

            // set info attr
            item.info = {};
            var info = infoData[testIndex];

            info.forEach(function (feature) {
                var attr = feature[info.columns[0]];
                var value = feature[info.columns[1]];
                item.info[attr] = attr === 'fitmedio' ? parseFloat(value) : parseInt(value);
            });

            //
            var population = 50;
            var iterations = iterationsData[testIndex];
            item.variances = [];
            item.iterations = Array(iterations.length/population).fill().map(function(_, i) {
                var iteration = iterations.slice(i*50, (i+1)*50).map(function(sample){
                    sample.fitness = parseFloat(sample.fitness);
                    return sample;
                });

                item.variances[i] =  d3.variance(iteration.map(function(sample){ return sample.fitness; }));

                return iteration;
            });

            console.log(item);
            return item;
        });

        return dataset;
    });
}

function updateDataset() {
    //
    var promiseList = [];

    algorithms.forEach(function(alg) {
        promiseList.push(loadDatasetForAlgorithm(alg));
    });

    return Promise.all(promiseList);
}

function getBoxPlots () {
    return algenBoxPlots;
}

function renderDataset(){

    boxplots.update();

    pcaPlots.update();
    //#end
}

function loadDataset(dataset) {

    //var useSel = true;
    //var selVal = document.getElementById('alg-select').value;
    //console.log(document.getElementById('alg-select').value);
    //
    //if (useSel && selVal) {
    //    alg = selVal;
    //}

    // Box Plot
    boxplots = getBoxPlots();
    boxplots.normalizeData(dataset[selectedAlgorithm]);
    boxplots.render();

    // PCA
    pcaPlots.normalizedData(dataset);
    pcaPlots.render();
}

function init(){
    //#begin
    updateDataset()
        .then(function(dataset){
            console.log(dataset);
            loadDataset(dataset);
            //render
            renderDataset();
            
        });
}

init();