import { ReactNode, Children, isValidElement, ReactElement } from 'react'

export const pickChildrenByType = (
  children: ReactNode,
  ...childTypes: ReactElement['type'][]
) => {
  return (
    Children.map(children, (child) =>
      isValidElement(child) && childTypes.includes(child.type) ? child : null,
    ) || []
  )
}

export const omitChildrenByType = (
  children: ReactNode,
  ...childTypes: ReactElement['type'][]
) => {
  return Children.toArray(children).filter((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return true
    }

    return 'type' in child && !childTypes.includes(child.type)
  })
}
