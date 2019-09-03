<script >
    import {createEventDispatcher} from 'svelte';

    import * as Form from 'ketrics-ui-svelte/src/components/Form';
    import {Modal, Notification} from 'ketrics-ui-svelte/src/components';

    const dispatch = createEventDispatcher();
    export let ketricsService;

    let openForm = false,
        loading = false,
        data = {};

    export function remove($data){
        data = $data;
        openForm = true;
    }

    function handleClose(){
        openForm=false;
    }

    async function handleDelete(){
        loading = true;
        try{
            let {id} = data;
            await ketricsService.delete({id});
            dispatch('itemDeleted', id);
            Notification.success({message: 'Item Deleted!'});
            handleClose();
        }catch(error){
            Notification.error({message: error.message || 'Unhandled error!'});
        }
        loading = false;
    }

    $: disabled = loading ? {disabled:true}:{};
</script>

{#if openForm}
    <Modal onClose={handleClose}>
        <h3 class="title">Delete Item</h3>

        <p>Do you really want to delete the item {data.id}?</p>

        <div class="buttons is-right">
            <span class="button is-danger" class:is-loading={loading} {...disabled}
                on:click={handleDelete}
            >
                <span class="icon is-small">
                    <i class="fas fa-trash"></i>
                </span>
                <span>
                    Delete
                </span>
            </span>
            <span class="button" class:is-loading={loading} {...disabled}
                on:click={handleClose}
                >Cancel</span>
        </div>
    </Modal>
{/if}
