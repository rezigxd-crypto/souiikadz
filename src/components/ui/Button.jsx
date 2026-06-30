/**
 * Button — primary design-system button primitive.
 * Variants: primary | outline | ghost | gold | danger
 * Sizes: sm | md | lg
 */
export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  children,
  ...rest
}) {
  const sizeCls = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''
  const blockCls = block ? 'btn-block' : ''
  return (
    <As
      className={`btn btn-${variant} ${sizeCls} ${blockCls} ${className}`}
      {...rest}
    >
      {children}
    </As>
  )
}
