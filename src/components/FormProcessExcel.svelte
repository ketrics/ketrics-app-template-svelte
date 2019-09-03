<script >
    import {createEventDispatcher} from 'svelte';

    import * as Form from 'ketrics-ui-svelte/src/components/Form';
    import {Modal, Notification} from 'ketrics-ui-svelte/src/components';

    const dispatch = createEventDispatcher();
    export let ketricsService;

    let openForm = false,
        loading = false,
        data = {},
        file = {name:''};

    export function upload($data){
        data = $data;
        openForm = true;
    }

    function handleCloseForm(){
        openForm=false;
    }

	async function handleUploadFile(){
        loading=true;
        try{
            const formData = new FormData();
            formData.append('file', file);
            const data = await ketricsService.readExcel(formData);
            await processData(data);
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error'});
        }
        loading=false;
	}

	async function processData($content){
	    const {id} = data;
        const detail = await ketricsService.processExcelData($content);

        loading = true;
        try{
            const $data = await ketricsService.saveDetail({id, detail});
            dispatch('fileUploaded', $data);
            handleCloseForm();
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
	}

    function handleChangeFile(e){
        file = e.target.files[0];
    }

    $: disabled = loading ? {disabled:true}:{};
</script>


{#if openForm}
    <Modal onClose={handleCloseForm}>
        <h3 class="is-3">Upload File</h3>

        <div class="field">
        <div class="file is-info has-name is-fullwidth">
            <label class="file-label">
            <input class="file-input" type="file" name="settings" on:change={e=>handleChangeFile(e)} >
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-file"></i>
                </span>
                <span class="file-label">
                    File Type
                </span>
            </span>
            <span class="file-name">
                {file.name}
            </span>
            </label>
        </div>
        </div>

        <div class="buttons is-right">
            <span class="button is-info" class:is-loading={loading} {...disabled}
                on:click={handleUploadFile}
            >
                <span class="icon is-small">
                    <i class="fas fa-upload"></i>
                </span>
                <span>
                    Upload File
                </span>
            </span>
            <span class="button" class:is-loading={loading} {...disabled}
                on:click={handleCloseForm}
                >Cancel</span>
        </div>
    </Modal>
{/if}
