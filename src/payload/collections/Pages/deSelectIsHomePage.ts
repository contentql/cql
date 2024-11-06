import { type Payload } from 'payload'

export const deSelectIsHomePage = async ({ payload }: { payload: Payload }) => {
  try {
    // Fetch the document(s) with the specified path
    const { docs: pageData } = await payload.find({
      collection: 'pages',
      where: {
        isHome: {
          equals: true,
        },
      },
    })

    // Check if there's at least one document to update
    if (pageData && pageData.length > 0) {
      const updatePage = await payload.update({
        collection: 'pages',
        id: pageData[0].id, // Assuming 'id' is the correct field
        data: {
          isHome: false,
        },
      })

      return updatePage
    } else {
      console.log('No page found with the specified path.')
      return null
    }
  } catch (error) {
    console.error('Error updating page:', error)
    throw error
  }
}
