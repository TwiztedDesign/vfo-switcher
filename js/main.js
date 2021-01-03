angular.module('switcherApp',[])
    .controller('switcherController', ['$scope', function($scope) {
        $scope.data = vff.state;
        $scope.data.settings = vff.state.settings || {
            keyFunc         :'prv',
            userControl     : true,
            userDirectorView: true
        };
        $scope.data.cameras = vff.state.cameras || [
            {
                name:'Camera 1',
                crop: [0,0,0.5,0.5],
                enable: true
            },
            {
                name:'Camera 2',
                crop: [0.5,0,1,0.5],
                enable: true
            },
            {
                name:'Camera 3',
                crop: [0,0.5,0.5,1],
                enable: true
            },
            {
                name:'Camera 4',
                crop: [0.5,0.5,1,1],
                enable: true
            }
        ];

        $scope.data.selectedCamera = 1;
        $scope.userSelectedCamera=0;
        $scope.selectedPrv=0;
        $scope.settingsVisibility = false;
        $scope.directorView = true;
        
        $scope.getSelectedCamera = function(index){
            return $scope.data.cameras[index];
        }

        vff.ready(()=>{
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.$apply();
        });

        vff.onModeChange(() => {
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.$apply();
        });

        vff.onStateChange(e => {
            if(!$scope.edit){
                handleOrientation();        
                $scope.$apply();
            }
        });

        vff.onDeviceChange((e)=>{
            $scope.isMobile = vff.isMobile;
            handleOrientation();
            $scope.$apply();
        });

        $scope.switchCamera = function(index){
            $scope.data.selectedCamera = index;
            vff.send();
        }

        $scope.selectCamera = function(index){
            $scope.directorView= false;
            $scope.userSelectedCamera = index;
            handleOrientation();
        }

        $scope.prvCamera = function(index){
            $scope.selectedPrv = index;
        }

        $scope.take= function(){
            let prev = $scope.data.selectedCamera;
            $scope.switchCamera($scope.selectedPrv);
            $scope.prvCamera(prev);
        }

        $scope.toggleSettings = function(){
            if($scope.settingsVisibility){
                vff.send();
            }
            $scope.settingsVisibility = !$scope.settingsVisibility;
        }

        $scope.toggleDirectorView = function(){
            $scope.directorView = true;
            handleOrientation();
        }

        function handleOrientation() {
            if($scope.edit){
                vff.transform(0,0,1,1,0.125, 0, 0.875, 0.75);
            }else{
                let selectedCamera = $scope.directorView?$scope.data.cameras[$scope.data.selectedCamera] : $scope.data.cameras[$scope.userSelectedCamera];
                vff.transform(selectedCamera.crop[0],selectedCamera.crop[1],selectedCamera.crop[2],selectedCamera.crop[3],0);
            }
        }
        window.addEventListener('resize', handleOrientation);  
        
        window.addEventListener('keydown', function(e) {
            if(!$scope.settingsVisibility){
                if(e.key==='1' || e.key==='2' || e.key==='3' || e.key==='4'){
                    if($scope.data.settings.keyFunc==='prv'){
                        $scope.prvCamera(parseInt(e.key)-1);
                        $scope.$apply();
                    }else{
                        $scope.switchCamera(parseInt(e.key)-1);
                        $scope.$apply();
                    }
                }else if (e.code==='Space' && $scope.data.selectedCamera !== $scope.selectedPrv ){
                    $scope.take();
                }
            }
        });
    }]);