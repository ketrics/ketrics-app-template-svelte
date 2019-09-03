<script >
    import {onMount, createEventDispatcher} from 'svelte';

    import * as Form from 'ketrics-ui-svelte/src/components/Form';
    import {Modal, Notification} from 'ketrics-ui-svelte/src/components';

    const dispatch = createEventDispatcher();

    export let ketricsService;

    let openForm = false,
        loading = false,
        data = {},
        mode = null;

    export function add(){
        data = {
            name: ''
        }
        mode = 'create';

        openForm=true;
    }

    export function edit($data){
        data = $data;
        mode = 'update';
        openForm = true;
    }

    function handleClose(){
        openForm=false;
    }

    async function handleSave(){
        loading = true;
        try{
            data = await ketricsService.save(data);
            dispatch('dataSaved', data);
            Notification.success({message: 'Operacion Saved!'});
            handleClose();
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
    }

    $: disabled = loading ? {disabled:true}:{};
    $: title = mode === 'create' ? 'Create new Item' : 'Update Item';
</script>

{#if openForm}
    <Modal onClose={handleClose}>

        <h1 class="title">{title}</h1>
        <div class="columns">
            <div class="column is-3">
                <Form.FormField label="Name">
                    <Form.Input bind:value={data.name}
                                     placeholder="Name"
                    />
                </Form.FormField>
            </div>
        </div>


        <div class="buttons is-right">
            <span class="button is-info" class:is-loading={loading} {...disabled}
                on:click={handleSave}
                >
                    <span class="icon is-small">
                        <i class="fas fa-save"></i>
                    </span>
                    <span>
                        Save
                    </span>
                </span>
            <span class="button" class:is-loading={loading} {...disabled}
                on:click={handleClose}
                >Cancel</span>
        </div>
    </Modal>
{/if}
