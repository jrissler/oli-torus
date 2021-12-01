defmodule OliWeb.Users.Common do
  use Surface.LiveComponent

  def render(assigns) do
    ~F"""
    <div>nothing</div>
    """
  end

  def render_email_column(
        assigns,
        %{email: email, locked_at: locked_at} = row,
        _
      ) do
    checkmark =
      case row do
        %{independent_learner: false} ->
          nil

        _ ->
          ~F"""
          <span data-toggle="tooltip" data-html="true" title="<b>Email Confirmed</b>">
            <i class="las la-check text-success"></i>
          </span>
          """
      end

    ~F"""
      <div class="d-flex flex-row">
       {email} <div class="flex-grow-1"></div> {checkmark}
      </div>
      <div>
        {#if !is_nil(locked_at)}
          <span class="badge badge-warning"><i class="las la-user-lock"></i> Account Locked</span>
        {/if}
      </div>
    """
  end
end
