var algorithms = ['pmx1', 'pmx2', 'pmx3', 'pmx4', 'pmx5', 'pmx6'];
var selectedAlgorithm = ['0', '1'];

!function(){
    var dataset;
    var treeData;

    function subscribeSelection (selectId, index) {
        var selElem = document.createElement('select');
        selElem.setAttribute('id', selectId + index);
        
        algorithms.forEach(function(name, i){
            var optElem = document.createElement('option');
            optElem.setAttribute('value', i);
            optElem.textContent = name;

            if (index === i){
                optElem.setAttribute('selected', true);
            }
            selElem.append(optElem);
        });

        var menuItem = document.createElement('li');
        menuItem.append(selElem);

        var menuElem = document.querySelector('.menu-select')
        menuElem.append(menuItem);


        selElem.addEventListener('change', function(e) {
            selectedAlgorithm[index-1] = this.value;

            document.getElementById('boxes' + index).remove();
            document.getElementById('bars' + index).remove();
            document.getElementById('dendogram' + index).remove();

            plot(index);

        });
    }

    function getJson(url) {
        return new Promise(function(resolve){
            d3.json(url, function(data) {
                resolve(data);
            });
        });
    }

    function updateDataset(urlList) {   
        return Promise.all(urlList.map(function(url){
            return getJson(url);
        }));
    }
    var myCoordinate;
    function getOptions(index){
        console.assert(index !== undefined);
        return {
            viewsContainer: '#view' + index,
            boxesId: 'boxes' + index,
            barsId: 'bars' + index,
            dendogramId: 'dendogram' + index
        }
    }
    function getSelectedAlgorithm(index) {
        return selectedAlgorithm[index-1];
    }

    function plot(index) {
       
        var options = getOptions(index);
        var selectedAlgorithm = getSelectedAlgorithm(index);
        //
        var mybars = barsPlot(options.viewsContainer, options.barsId);
        mybars.render(mybars.normalizeData(dataset[selectedAlgorithm]));
        
        // Box Plot
        var myBoxes = boxPlots(options.viewsContainer, options.boxesId);
        myBoxes.render(myBoxes.normalizeData(dataset[selectedAlgorithm]));

        //
        var myDendogram = dendogramPlot(options.viewsContainer, options.dendogramId);
        myDendogram.render(treeData[selectedAlgorithm]);

        // var myTree = treePlot('tree1');
        // var treeData = myTree.normalizeData(dataset[selectedAlgorithm]);
        // myTree.render(treeData);

        // PCA
        // pcaPlots.normalizedData(dataset);
        // pcaPlots.init();

    }

    function renderDataset(index) {
        

        // subscribe option
        subscribeSelection('alg-select', index);
        plot(index);
    }

    function init() {
        //#begin
        updateDataset([
            '../scripts/pmx.json',
            '../scripts/treeData.json'
            ])
            .then(function(data){
                
                //
                dataset = data[0];
                treeData = data[1];
                
                myCoordinate = coordinatesPlot('#main', 'coordinates');
                var multidata = dataset[selectedAlgorithm[0]].concat(dataset[selectedAlgorithm[1]]);
                myCoordinate.render(multidata);
                //render
                renderDataset(1);
                renderDataset(2);
                
                //#end
            });
    }

    init();
}();