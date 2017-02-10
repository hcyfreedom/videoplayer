/**
 * Created by Acer on 2016/10/10.
 */
(function (widnow,document) {
    //获取了视频元素、 视频控件容器、 播放按钮，全屏切换按钮和三个进度条容器。为了避免我们每次访问这些元素的时候都要遍历DOM，现在我们对这些元素的位置进行"缓存"
    var video = document.getElementsByTagName('video')[0],
        videoControls = document.getElementById('videoControls'),
        play = document.getElementById('play'),
        progressContainer = document.getElementById("progress"),
        progressHolder = document.getElementById("progress_box"),
        playProgressBar = document.getElementById("play_progress");


        //创建一个包含所有方法的videoPlayer对象来尽可能实现代码的简洁，还将创建页面加载时就会被调用的init方法。
    var videoPlayer = {
        init:function () {
            var that = this;//相当于videoPlaye对象
            document.documentElement.className = 'js';//通过创建一个js的类名来引用documentElement或html元素,便于书写css代码
            video.removeAttribute('controls');//removeAttribute() 方法删除指定的属性
            video.addEventListener('loadeddata',this.initializeControls,false);//When meta data is ready, show the controls
            this.handleButtonPresses();//When play, pause buttons are pressed. 

        },
        initializeControls :function () {
            videoPlayer.showHideControls();// When all meta information has loaded, show controls
        },

        showHideControls : function(){
            //Shows and hides the video player.
            video.addEventListener('mouseover', function() {
                videoControls.style.opacity = 1;
            }, false);

            videoControls.addEventListener('mouseover', function() {
                videoControls.style.opacity = 1;
            }, false);

            video.addEventListener('mouseout',function () {
                videoControls.style.opacity = 0;
            },false);

            videoControls.addEventListener('mouseout', function() {
                videoControls.style.opacity = 0;
            }, false);
        },

        handleButtonPresses : function () {
            //when the video or play button is clicked,play/pause the video
            video.addEventListener('click',this.playPause,false);
            play.addEventListener('click',this.playPause,false);

            //When the play button is pressed,
            // switch to the "Pause" symbol.
            video.addEventListener('play',function () {
                play.title = 'Pause';
                play.innerHTML = '<span id="pauseButton"><img src="play.png"></span>';

                //Begin tracking video's progress
                videoPlayer.trackPlayProgress();
            },false);

            // When the pause button is pressed,
            // switch to the "Play" symbol.
            video.addEventListener('pause', function() {
                play.title = 'Play';
                play.innerHTML = '<img src="img/button.png">';

                // Video was paused, stop tracking progress.
                videoPlayer.stopTrackingPlayProgress();
            }, false);

            // When the video has concluded, pause it.
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                this.pause();
            }, false);



        },

        playPause: function() {
            if ( video.paused || video.ended ) {
                if ( video.ended ) { video.currentTime = 0; }
                video.play();
            }
            else { video.pause(); }
        },
        // Every 50 milliseconds, update the play progress.
        trackPlayProgress : function(){
            (function progressTrack() {
                videoPlayer.updatePlayProgress();
                playProgressInterval = setTimeout(progressTrack, 50);
            })();
        },

        updatePlayProgress : function(){
            playProgressBar.style.width = ( (video.currentTime / video.duration) * (progressHolder.offsetWidth) ) + "px";
        },

        // Video was stopped, so stop updating progress.
        stopTrackingPlayProgress : function(){
            clearTimeout( playProgressInterval );
        },

        videoScrubbing : function() {
            progressHolder.addEventListener("mousedown", function(){
                videoPlayer.stopTrackingPlayProgress();

                videoPlayer.playPause();

                document.onmousemove = function(e) {
                    videoPlayer.setPlayProgress( e.pageX );
                }

                progressHolder.onmouseup = function(e) {
                    document.onmouseup = null;
                    document.onmousemove = null;

                    video.play();
                    videoPlayer.setPlayProgress( e.pageX );
                    videoPlayer.trackPlayProgress();
                }
            }, true);
        },

        setPlayProgress : function( clickX ) {
            var newPercent = Math.max( 0, Math.min(1, (clickX - this.findPosX(progressHolder)) / progressHolder.offsetWidth) );
            video.currentTime = newPercent * video.duration;
            playProgressBar.style.width = newPercent * (progressHolder.offsetWidth)  + "px";
        },

        findPosX : function(progressHolder) {
            var curleft = progressHolder.offsetLeft;
            while( progressHolder = progressHolder.offsetParent ) {
                curleft += progressHolder.offsetLeft;
            }
            return curleft;
        }


    };




    videoPlayer.init();
}(this,document))
