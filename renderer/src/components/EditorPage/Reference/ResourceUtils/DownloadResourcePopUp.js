import React from 'react';
import PropTypes from 'prop-types';
// import localforage, * as localForage from 'localforage';
import { Dialog, Transition } from '@headlessui/react';
// import { useTranslation } from 'react-i18next';
import { SnackBar } from '@/components/SnackBar';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography,
 } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import DownloadSvg from '@/icons/basil/Outline/Files/Download.svg';

 // mui styles for accordion
const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#454545',
    // color: '#fff',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0px 0px 15px 1px rgba(0,0,0,0.43);',

  },
  summary: {
    // backgroundColor: '#212121',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: '500',
    // color: '#ffffff',
    color: '#000',
  },
}));

function DownloadResourcePopUp({ selectResource, isOpenDonwloadPopUp, setIsOpenDonwloadPopUp }) {
    // const { t } = useTranslation();
    const [snackBar, setOpenSnackBar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadFilterDiv, setLoadFilterDiv] = React.useState(false);
    const [snackText, setSnackText] = React.useState('');
    const [notify, setNotify] = React.useState();

    const [resourceData, setresourceData] = React.useState([]);

    const modalClose = () => {
        setIsOpenDonwloadPopUp(false);
      };

    const fetchResource = async () => {
        setLoading(true);
        const url = 'https://git.door43.org/api/catalog/v5/search?subject=Aligned%20Bible&subject=Bible&lang=en&lang=ml&lang=hi';
        await fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // console.log('fetched out res ->', res.data);
            const temp_resource = {};
            res.data.forEach((element) => {
                element.isChecked = false;
                if (element.language in temp_resource) {
                    temp_resource[element.language].push(element);
                } else {
                    temp_resource[element.language] = [element];
                }
            });
            setresourceData(temp_resource);
            setLoading(false);
        });
    };

    const handleCheckbox = (e, obj) => {
      const temp_resource = resourceData;
      if (obj.selection === 'full') {
        // eslint-disable-next-line array-callback-return
        temp_resource[obj.id].map((row) => {
          row.isChecked = e.target.checked;
        });
      } else if (obj.selection === 'single') {
        // eslint-disable-next-line array-callback-return
        temp_resource[obj.parent].filter((row) => {
          if (row.id === obj.id) {
            row.isChecked = e.target.checked;
          }
        });
      }
      setresourceData((current) => ({
        ...current,
        ...temp_resource,
      }));
      // console.log('after updatechecked : ', resourceData);
    };

    const handleClickFilter = () => {
      if (!loading) {
        console.log('clicked filter : ', loadFilterDiv);
        setLoadFilterDiv(!loadFilterDiv);
      }
    };

    React.useEffect(() => {
        fetchResource();
    }, []);

    const classes = useStyles();

    return (
      <>
        <Transition
          show={isOpenDonwloadPopUp}
          as={React.Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            static
            open={isOpenDonwloadPopUp}
            onClose={modalClose}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="flex items-center justify-center h-screen">
              <div className="flex-col w-2/5 max-h-[32rem] items-center justify-center  z-50 shadow rounded bg-white">

                <div className="w-full bg-secondary text-center text-white p-1 rounded-t">
                  <div aria-label="resources-download-title" className="z-50 flex uppercase justify-center p-2 text-xs tracking-widest leading-snug">
                    {selectResource}
                    {' '}
                    Resource Collection
                  </div>
                </div>

                <div className="w-full bg-white mt-2 p">
                  <div aria-label="resources-download-filter" className="z-50 flex justify-between  p-2  ">
                    <span className="text-sm font-medium">Select Resources to Download </span>
                    <div className="flex gap-4">
                      <span className="cursor-pointer" title="filter" role="button" tabIndex={-2} onClick={handleClickFilter}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                      </span>
                      <span className="text-xs cursor-pointer" title="download">
                        <DownloadSvg
                          fill="currentColor"
                          className="w-7 h-7"
                        />
                      </span>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-full bg-white my-3 ">
                  <div aria-label="resources-download-content" className="flex-col  p-2 ">
                    {loading ? <LoadingScreen /> : (
                      <>
                        {Object.keys(resourceData).map((element) => (
                          <div className="mb-1">
                            <Accordion className={classes.root}>
                              <AccordionSummary
                                expandIcon={<ExpandMore style={{ color: '#000' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                className={classes.summary}
                              >
                                <Typography className={classes.heading}>
                                  <div className="flex gap-3 justify-center items-center">
                                    <input type="CheckBox" className="" onChange={(e) => handleCheckbox(e, { selection: 'full', id: element })} />
                                    <h4>{`${resourceData[element][0].language_title} (${element})`}</h4>
                                  </div>
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>

                                <div className="w-full">
                                  <div className="grid grid-cols-5 gap-2 text-center">
                                    <div />
                                    <div className="col-span-2 font-medium">Resource</div>
                                    <div className="col-span-2 font-medium">Organization</div>
                                  </div>
                                  <hr />
                                  {resourceData[element].map((row) => (
                                    <div className="grid grid-cols-5 gap-2 text-center p-1.5 text-sm">
                                      <div>
                                        <input type="CheckBox" checked={row.isChecked} className="" onChange={(e) => handleCheckbox(e, { selection: 'single', id: row.id, parent: element })} />
                                      </div>
                                      <div className="col-span-2">{row.name}</div>
                                      <div className="col-span-2">{row.owner}</div>
                                    </div>
                                ))}
                                </div>
                              </AccordionDetails>
                            </Accordion>
                            <hr />
                          </div>
                  ))}

                      </>
                  )}
                  </div>
                </div>

              </div>
            </div>

          </Dialog>
        </Transition>

        <SnackBar
          openSnackBar={snackBar}
          snackText={snackText}
          setOpenSnackBar={setOpenSnackBar}
          setSnackText={setSnackText}
          error={notify}
        />

      </>
    );
}

DownloadResourcePopUp.propTypes = {
    selectResource: PropTypes.string,
    isOpenDonwloadPopUp: PropTypes.bool,
    setIsOpenDonwloadPopUp: PropTypes.bool,
  };

export default DownloadResourcePopUp;
