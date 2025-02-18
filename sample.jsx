<div className="white-box-global call-records">
  <div className="row">
    <div className="col-md-6">
      <div className="white-box-header">
        <h3>Call Duration : {callInsight.duration}</h3>
      </div>
    </div>
    <div className="col-md-6" style={{ padding: "10px", paddingRight: "20px" }}>
      <input
        style={{
          backgroundColor: "#5bc0de",
          padding: "5px 10px",
          borderRadius: "5px",
          color: "white",
        }}
        className="pull-right  "
        type="submit"
        onClick={play}
        value={isPlaying ? "Pause" : "Play"}
      />
    </div>
  </div>
  <div
    className="row"
    style={{
      height: "250px",
      paddingLeft: "20px",
      paddingRight: "20px",
    }}
  >
    {!isPending && (
      <WaveSurfer plugins={plugins} onMount={handleWSMount} scrollParent="true">
        <div id="timeline" />
        <WaveForm id="waveform">
          {regions.map((regionProps) => (
            <Region
              onUpdateEnd={handleRegionUpdate}
              key={regionProps.id}
              {...regionProps}
            />
          ))}
        </WaveForm>
      </WaveSurfer>
    )}
  </div>

  {localStorage.getItem("usecase") == "Insurance - PCVC Verification" ? (
    <div className="row">
      <div style={{ textAlign: "center" }}>
        {speakers &&
          speakers.map((speaker) => (
            <>
              {speaker == "agent" && (
                <>
                  <a
                    onClick={() => regionFilterFun("speaker", "agent")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255, 196, 226, 0.4)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Agent
                  </a>
                  &nbsp;
                </>
              )}

              {speaker == "customer" && (
                <>
                  <a
                    onClick={() => regionFilterFun("speaker", "customer")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255, 255, 0, 0.4)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Customer
                  </a>
                  &nbsp;
                </>
              )}
            </>
          ))}
      </div>
    </div>
  ) : (
    <div className="row">
      <div style={{ textAlign: "center" }}>
        {speakers &&
          speakers.map((speaker) => (
            <>
              {speaker == "agent" && (
                <>
                  <a
                    onClick={() => regionFilterFun("speaker", "agent")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255, 196, 226, 0.4)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Agent
                  </a>
                  &nbsp;
                </>
              )}

              {speaker == "customer" && (
                <>
                  <a
                    onClick={() => regionFilterFun("speaker", "customer")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255, 255, 0, 0.4)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Customer
                  </a>
                  &nbsp;
                </>
              )}
            </>
          ))}
        <a style={{ fontSize: "20px" }}>
          &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
        </a>
        {emotions &&
          emotions.map((emotion) => (
            <>
              {emotion == "Happy" && (
                <>
                  <a
                    onClick={() => regionFilterFun("emotion", "Happy")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(0,228,255,0.2)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Happy
                  </a>
                  &nbsp;
                </>
              )}

              {emotion == "Fearful" && (
                <>
                  <a
                    onClick={() => regionFilterFun("emotion", "Fearful")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(0,64,255,0.2)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Fearful
                  </a>
                  &nbsp;
                </>
              )}

              {emotion == "Angry" && (
                <>
                  <a
                    onClick={() => regionFilterFun("emotion", "Angry")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(58,255,0,0.2)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Angry
                  </a>
                  &nbsp;
                </>
              )}

              {emotion == "Sad" && (
                <>
                  <a
                    onClick={() => regionFilterFun("emotion", "Sad")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255,0,255,0.2)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Sad
                  </a>
                  &nbsp;
                </>
              )}

              {emotion == "Calm" && (
                <>
                  <a
                    onClick={() => regionFilterFun("emotion", "Calm")}
                    style={{
                      cursor: "cell",
                      backgroundColor: "rgba(255,0,0,0.2)",
                      fontSize: "15px",
                      color: "black",
                      padding: "8px",
                      borderRadius: "15px",
                    }}
                  >
                    Calm
                  </a>
                  &nbsp;
                </>
              )}
            </>
          ))}
      </div>
    </div>
  )}

  {/* <Wavesurfer
                                                src={callInsight.audio_file}
                                                position={position}
                                                onPositionChange={handlePositionChange}
                                                onReady={onReadyHandler}
                                                muted={muted}
                                                playing={playing}
                                                zoomLevel={zoomLevel}
                                                options={waveOptions}
                                            >
                                                <Timeline options={timelineOptions} />
                                            </Wavesurfer> */}
  {/* {!playing && <button className="btn btn-info center-block" onClick={handlePlayPause}><i className="fa fa-play-circle" aria-hidden="true"></i> &nbsp;Play</button>}
                                            {playing && <button className="btn btn-success center-block" onClick={handlePlayPause}><i className="fa fa-pause-circle" aria-hidden="true"></i> &nbsp;Pause</button>} */}
  <br />
</div>;
