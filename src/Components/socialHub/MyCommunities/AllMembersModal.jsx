import React from 'react'
import Modal from '../../../Utils/Modal';
import ModalMember from './ModalMember';

const AllMembersModal = ({communityName,members, onClose}) => {
    return (
        <Modal title={`${communityName ? communityName + "'s " : 'Community '} Members`} onClose={onClose}>
            <div className='flex flex-col gap-5'>
                {
                    members && members.map((member) => (
                        <ModalMember member={member} />
                    ))
                }
            </div>
        </Modal>
    );
}

export default AllMembersModal