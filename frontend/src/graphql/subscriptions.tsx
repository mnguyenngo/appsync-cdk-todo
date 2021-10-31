
export const onCreateNoteSubscription = `
  subscription onCreateNote {
    onCreateNote {
      id name completed
    }
  }
`

export const onUpdateNoteSubscription = `
  subscription onUpdateNote {
    onUpdateNote {
      id name completed
    }
  }
`

export const onDeleteNoteSubscription = `
  subscription onDeleteNote {
    onDeleteNote {
      id name completed
    }
  }
`